import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Dumbbell, Flame, Target, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getCurrentProfile, supabase, type AppUser } from "@/lib/supabase";
import LoadingScreen from "@/components/LoadingScreen";

type BookingRow = {
  id: string;
  notes: string | null;
  status: "confirmed" | "cancelled" | "completed";
  created_at: string;
  programs: {
    name: string;
    intensity: string | null;
  } | null;
  slots: {
    id: string;
    slot_start: string;
    slot_end: string;
    trainers: {
      first_name: string;
      last_name: string;
      headline: string | null;
    } | null;
  } | null;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "TBD";

const formatTime = (value?: string) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const getStatusClass = (status: BookingRow["status"]) => {
  if (status === "confirmed") return "bg-primary/10 text-primary";
  if (status === "completed") return "bg-energy text-energy-foreground";
  return "bg-muted text-muted-foreground";
};

const redActionClass =
  "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:text-white hover:shadow-primary/35";

const Dashboard = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const currentProfile = await getCurrentProfile();
      setProfile(currentProfile);
      if (!currentProfile) return;

      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, notes, status, created_at, programs(name, intensity), slots(id, slot_start, slot_end, trainers(first_name, last_name, headline))"
        )
        .eq("user_id", currentProfile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBookings((data ?? []) as unknown as BookingRow[]);
    } catch (err: any) {
      toast({
        title: "Could not load dashboard",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const upcomingBookings = useMemo(() => {
    const now = Date.now();
    return bookings
      .filter((booking) => {
        const start = booking.slots?.slot_start;
        return booking.status === "confirmed" && start && new Date(start).getTime() >= now;
      })
      .sort(
        (a, b) =>
          new Date(a.slots?.slot_start ?? 0).getTime() -
          new Date(b.slots?.slot_start ?? 0).getTime()
      );
  }, [bookings]);

  const nextBooking = upcomingBookings[0];
  const completedCount = bookings.filter((booking) => booking.status === "completed").length;
  const confirmedCount = bookings.filter((booking) => booking.status === "confirmed").length;
  const programCount = new Set(bookings.map((booking) => booking.programs?.name).filter(Boolean)).size;

  const cancelBooking = async (booking: BookingRow) => {
    setCancellingId(booking.id);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", booking.id);
      if (error) throw error;

      toast({
        title: "Session cancelled",
        description: "The time slot is available again.",
      });
      await loadDashboard();
    } catch (err: any) {
      toast({
        title: "Could not cancel session",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
                Member Dashboard
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}
              </h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Track your sessions, keep your next workout in view, and jump back into booking when your schedule opens up.
              </p>
            </div>
            <Button asChild size="lg" className={redActionClass}>
              <Link to="/book">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Session
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed Sessions</p>
                <p className="text-3xl font-bold">{confirmedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{completedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-power/10 flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-power" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Programs Tried</p>
                <p className="text-3xl font-bold">{programCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading your schedule...</p>
              ) : upcomingBookings.length ? (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => {
                    const trainer = booking.slots?.trainers;
                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">
                              {booking.programs?.name ?? "Training Session"}
                            </h3>
                            <Badge className={getStatusClass(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDate(booking.slots?.slot_start)} from {formatTime(booking.slots?.slot_start)} to {formatTime(booking.slots?.slot_end)}
                          </p>
                          <p className="mt-1 text-sm">
                            {trainer
                              ? `${trainer.first_name} ${trainer.last_name}`
                              : "Trainer pending"}
                            {trainer?.headline ? ` - ${trainer.headline}` : ""}
                          </p>
                          {booking.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {booking.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          className="border-primary/30 text-primary hover:border-primary hover:bg-primary hover:text-white"
                          onClick={() => cancelBooking(booking)}
                          disabled={cancellingId === booking.id}
                        >
                          {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">No sessions booked yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Choose a trainer and program to get your next workout on the calendar.
                  </p>
                  <Button asChild className={`mt-5 ${redActionClass}`}>
                    <Link to="/book">Book your first session</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-energy" />
                Next Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextBooking ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-primary/10 p-4">
                    <p className="text-sm text-primary font-semibold">
                      {formatDate(nextBooking.slots?.slot_start)}
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {formatTime(nextBooking.slots?.slot_start)}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">{nextBooking.programs?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {nextBooking.slots?.trainers
                        ? `${nextBooking.slots.trainers.first_name} ${nextBooking.slots.trainers.last_name}`
                        : "Trainer pending"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                    <UserRound className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Your next session will appear here as soon as you book it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
