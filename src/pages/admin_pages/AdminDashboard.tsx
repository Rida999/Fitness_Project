import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock,
  Dumbbell,
  LayoutDashboard,
  Plus,
  UserRound,
  Users,
} from "lucide-react";

type Booking = {
  id: string;
  status: string;
  created_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
  programs: {
    name: string;
  } | null;
  slots: {
    slot_start: string;
    trainers: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
};

const statsConfig = [
  { key: "users", label: "Users", icon: Users },
  { key: "trainers", label: "Active Trainers", icon: UserRound },
  { key: "programs", label: "Active Programs", icon: Dumbbell },
  { key: "slots", label: "Open Slots", icon: CalendarClock },
] as const;

const quickActions = [
  { label: "Add Program", href: "/admin/programs", icon: Dumbbell },
  { label: "Add Trainer", href: "/admin/trainers", icon: UserRound },
  { label: "Create Slots", href: "/admin/slots", icon: Plus },
  { label: "Manage Bookings", href: "/admin/bookings", icon: CalendarClock },
];

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "No date";

const profileName = (booking: Booking) => {
  const name = [booking.profiles?.first_name, booking.profiles?.last_name]
    .filter(Boolean)
    .join(" ");
  return name || booking.profiles?.email || "Unknown user";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    trainers: 0,
    programs: 0,
    slots: 0,
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      const [
        usersResult,
        trainersResult,
        programsResult,
        slotsResult,
        bookingsResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("trainers")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("programs")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("slots")
          .select("id", { count: "exact", head: true })
          .eq("is_booked", false)
          .gte("slot_start", new Date().toISOString()),
        supabase
          .from("bookings")
          .select(
            "id, status, created_at, profiles(email, first_name, last_name), programs(name), slots(slot_start, trainers(first_name, last_name))"
          )
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      setStats({
        users: usersResult.count ?? 0,
        trainers: trainersResult.count ?? 0,
        programs: programsResult.count ?? 0,
        slots: slotsResult.count ?? 0,
      });
      setBookings((bookingsResult.data ?? []) as unknown as Booking[]);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  const confirmedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === "confirmed").length,
    [bookings]
  );

  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
              <LayoutDashboard className="h-4 w-4" />
              Admin control center
            </div>
            <h1 className="text-3xl font-bold">ReserveFit Admin</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Signed-in users with the email admin@admin.com can manage programs,
              trainers, available sessions, users, and bookings.
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/bookings">View Bookings</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map((item) => (
            <Card key={item.key}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold">
                    {loading ? "-" : stats[item.key]}
                  </p>
                </div>
                <div className="rounded-md bg-primary/10 p-3 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent bookings
                <Badge variant="secondary">{confirmedBookings} confirmed</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading bookings...</p>
              ) : bookings.length ? (
                bookings.map((booking) => {
                  const trainer = booking.slots?.trainers;
                  return (
                    <div
                      key={booking.id}
                      className="flex flex-col gap-2 rounded-md border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <div className="font-semibold">{profileName(booking)}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.programs?.name ?? "Training session"} with{" "}
                          {trainer
                            ? `${trainer.first_name} ${trainer.last_name}`
                            : "unassigned trainer"}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{booking.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(booking.slots?.slot_start)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No bookings yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {quickActions.map((action) => (
                <Button key={action.href} asChild variant="outline" className="justify-start">
                  <Link to={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
