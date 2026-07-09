-- ReserveFit / FitTrainer Pro Supabase schema
-- Run this file in the Supabase SQL Editor for a new project.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  phone_number text,
  avatar_url text,
  fitness_level text check (fitness_level in ('beginner', 'intermediate', 'advanced', 'athlete')),
  primary_goal text check (primary_goal in ('weight-loss', 'muscle-gain', 'strength', 'endurance', 'general', 'athletic')),
  subscription_status text not null default 'trial' check (subscription_status in ('active', 'inactive', 'trial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trainers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  photo_url text,
  headline text,
  bio text,
  rating numeric(2, 1) not null default 5.0 check (rating >= 0 and rating <= 5),
  clients_count integer not null default 0 check (clients_count >= 0),
  start_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_min integer check (duration_min > 0),
  duration_max integer check (duration_max > 0),
  intensity text not null default 'medium' check (intensity in ('low', 'medium', 'moderate', 'high', 'extreme', 'Variable', 'Medium', 'High', 'Very High')),
  icon text,
  features text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programs_duration_range check (
    duration_min is null or duration_max is null or duration_min <= duration_max
  )
);

alter table public.programs
add column if not exists is_active boolean not null default true;

create table if not exists public.slots (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.trainers(id) on delete cascade,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slots_valid_range check (slot_start < slot_end)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slot_id uuid not null references public.slots(id) on delete restrict,
  program_id uuid not null references public.programs(id) on delete restrict,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_one_per_slot unique (slot_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_user_id_profiles_fkey'
  ) then
    alter table public.bookings
    add constraint bookings_user_id_profiles_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;
  end if;
end;
$$;

create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_trainers_active on public.trainers(is_active);
create index if not exists idx_slots_trainer_start on public.slots(trainer_id, slot_start);
create index if not exists idx_bookings_user_id on public.bookings(user_id);

create or replace function public.email_registered(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where lower(email) = lower(trim(check_email))
  );
$$;

grant execute on function public.email_registered(text) to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_trainers_updated_at on public.trainers;
create trigger set_trainers_updated_at
before update on public.trainers
for each row execute function public.set_updated_at();

drop trigger if exists set_programs_updated_at on public.programs;
create trigger set_programs_updated_at
before update on public.programs
for each row execute function public.set_updated_at();

drop trigger if exists set_slots_updated_at on public.slots;
create trigger set_slots_updated_at
before update on public.slots
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and email = 'admin@admin.com'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone_number,
    fitness_level,
    primary_goal
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'fitness_level',
    new.raw_user_meta_data ->> 'primary_goal'
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    phone_number = excluded.phone_number,
    fitness_level = excluded.fitness_level,
    primary_goal = excluded.primary_goal;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.mark_slot_booked()
returns trigger
language plpgsql
as $$
begin
  if exists (select 1 from public.slots where id = new.slot_id and is_booked = true) then
    raise exception 'This slot is already booked.';
  end if;

  update public.slots
  set is_booked = true
  where id = new.slot_id;

  return new;
end;
$$;

drop trigger if exists on_booking_created on public.bookings;
create trigger on_booking_created
before insert on public.bookings
for each row execute function public.mark_slot_booked();

create or replace function public.release_cancelled_slot()
returns trigger
language plpgsql
as $$
begin
  if old.status <> 'cancelled' and new.status = 'cancelled' then
    update public.slots
    set is_booked = false
    where id = new.slot_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_booking_cancelled on public.bookings;
create trigger on_booking_cancelled
after update of status on public.bookings
for each row execute function public.release_cancelled_slot();

alter table public.profiles enable row level security;
alter table public.trainers enable row level security;
alter table public.programs enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read active trainers" on public.trainers;
drop policy if exists "Anyone can read active trainers" on public.trainers;
create policy "Anyone can read active trainers"
on public.trainers for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins can manage trainers" on public.trainers;
create policy "Admins can manage trainers"
on public.trainers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read programs" on public.programs;
drop policy if exists "Anyone can read active programs" on public.programs;
create policy "Anyone can read active programs"
on public.programs for select
to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins can manage programs" on public.programs;
create policy "Admins can manage programs"
on public.programs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read open slots" on public.slots;
create policy "Authenticated users can read open slots"
on public.slots for select
to authenticated
using (is_booked = false or public.is_admin());

drop policy if exists "Users can read slots for their own bookings" on public.slots;
create policy "Users can read slots for their own bookings"
on public.slots for select
to authenticated
using (
  exists (
    select 1
    from public.bookings
    where bookings.slot_id = slots.id
      and bookings.user_id = auth.uid()
  )
);

drop policy if exists "Admins can manage slots" on public.slots;
create policy "Admins can manage slots"
on public.slots for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can create their own bookings" on public.bookings;
create policy "Users can create their own bookings"
on public.bookings for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can read their own bookings" on public.bookings;
create policy "Users can read their own bookings"
on public.bookings for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can cancel their own bookings" on public.bookings;
create policy "Users can cancel their own bookings"
on public.bookings for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and status = 'cancelled');

drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
on public.bookings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.trainers (
  first_name,
  last_name,
  photo_url,
  headline,
  bio,
  rating,
  clients_count,
  start_date,
  is_active
)
values
  (
    'Sarah',
    'Johnson',
    null,
    'Strength and Conditioning Coach',
    'Sarah helps clients build strength, confidence, and sustainable training habits.',
    4.9,
    180,
    '2017-03-01',
    true
  ),
  (
    'Mike',
    'Rodriguez',
    null,
    'HIIT and Weight Loss Specialist',
    'Mike specializes in high-energy sessions built around fat loss, endurance, and motivation.',
    4.8,
    220,
    '2016-06-15',
    true
  )
on conflict do nothing;

insert into public.programs (
  name,
  description,
  duration_min,
  duration_max,
  intensity,
  icon,
  features
)
values
  (
    'Strength Training',
    'Progressive resistance workouts for building muscle and improving total-body strength.',
    45,
    60,
    'high',
    'dumbbell',
    array['Progressive overload', 'Form coaching', 'Full-body strength']
  ),
  (
    'HIIT Cardio',
    'Fast-paced interval training to improve endurance and burn calories.',
    25,
    40,
    'extreme',
    'running',
    array['Intervals', 'Conditioning', 'Calorie burn']
  ),
  (
    'Yoga Mobility',
    'Low-impact mobility and flexibility sessions for recovery and balance.',
    30,
    50,
    'low',
    'yoga',
    array['Mobility', 'Breathing', 'Recovery']
  )
on conflict do nothing;
