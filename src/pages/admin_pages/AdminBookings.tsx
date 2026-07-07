import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, CheckCircle2, RefreshCw, Search, XCircle } from "lucide-react";

type Booking = {
  id: string;
  status: "confirmed" | "cancelled" | "completed";
  notes: string | null;
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
    slot_end: string;
    trainers: {
      first_name: string;
      last_name: string;
    } | null;
  } | null;
};

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not scheduled";

const fullName = (profile: Booking["profiles"]) => {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
  return name || profile?.email || "Unknown user";
};

const statusVariant = (status: Booking["status"]) => {
  if (status === "cancelled") return "destructive";
  if (status === "completed") return "secondary";
  return "default";
};

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, status, notes, created_at, profiles(email, first_name, last_name), programs(name), slots(slot_start, slot_end, trainers(first_name, last_name))"
      )
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Could not load bookings",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setBookings((data ?? []) as unknown as Booking[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return bookings;
    return bookings.filter((booking) => {
      const trainer = booking.slots?.trainers;
      return [
        fullName(booking.profiles),
        booking.profiles?.email,
        booking.programs?.name,
        trainer ? `${trainer.first_name} ${trainer.last_name}` : "",
        booking.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [bookings, query]);

  const updateStatus = async (booking: Booking, status: Booking["status"]) => {
    setUpdatingId(booking.id);
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", booking.id);

    if (error) {
      toast({
        title: "Could not update booking",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setBookings((items) =>
        items.map((item) => (item.id === booking.id ? { ...item, status } : item))
      );
      toast({
        title: "Booking updated",
        description: `Status changed to ${status}.`,
      });
    }
    setUpdatingId(null);
  };

  return (
    <div className="min-h-screen bg-secondary/30 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bookings</h1>
            <p className="text-sm text-muted-foreground">
              Track reservations and manage session status.
            </p>
          </div>
          <Button variant="outline" onClick={loadBookings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search bookings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-muted-foreground">Loading bookings...</CardContent>
            </Card>
          ) : filteredBookings.length ? (
            filteredBookings.map((booking) => {
              const trainer = booking.slots?.trainers;
              return (
                <Card key={booking.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold">{fullName(booking.profiles)}</h2>
                          <Badge variant={statusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                          <span>{booking.profiles?.email}</span>
                          <span>{booking.programs?.name ?? "No program"}</span>
                          <span>
                            {trainer
                              ? `${trainer.first_name} ${trainer.last_name}`
                              : "No trainer"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarClock className="h-4 w-4" />
                            {formatDateTime(booking.slots?.slot_start)}
                          </span>
                        </div>
                        {booking.notes && (
                          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                            {booking.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          disabled={updatingId === booking.id || booking.status === "confirmed"}
                          onClick={() => updateStatus(booking, "confirmed")}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="outline"
                          disabled={updatingId === booking.id || booking.status === "completed"}
                          onClick={() => updateStatus(booking, "completed")}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Complete
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={updatingId === booking.id || booking.status === "cancelled"}
                          onClick={() => updateStatus(booking, "cancelled")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-6 text-muted-foreground">No bookings found.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
