# Supabase Database Setup

This folder contains a Supabase-ready database for the current ReserveFit frontend.

## Create the database

1. Create a new project at Supabase.
2. Open **SQL Editor**.
3. Paste and run everything in `schema.sql`.

The schema creates:

- `profiles`, linked to `auth.users`
- `trainers`
- `programs`
- `slots`
- `bookings`
- row-level security policies
- starter trainer and program data

## Admin Account

The current frontend treats this email as admin:

```text
admin@admin.com
```

Create that user in Supabase Auth, then sign in with it. Its profile row will be created automatically.

## Important

The existing app still calls a custom API at:

```text
http://localhost:3001
```

So this database is ready, but the frontend is not yet wired directly to Supabase. The next step is either:

- add a backend server that talks to Supabase and keeps the current API endpoints, or
- replace the Axios API layer with `@supabase/supabase-js` in the frontend.
