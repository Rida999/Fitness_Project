// src/pages/admin_pages/AdminSlots.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Calendar,
  User,
  CalendarPlus,
  CheckCircle,
  Sparkles,
  Timer,
  Users,
  Star,
  MapPin,
} from "lucide-react";

interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
  rating?: number;
  photo_url?: string;
}

const AdminSlots: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loadingTrainers, setLoadingTrainers] = useState(true);
  const [form, setForm] = useState({
    trainer_id: "",
    slot_start: "",
    slot_end: "",
  });
  const [splitSlots, setSplitSlots] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("trainers")
          .select("id, first_name, last_name, rating, photo_url")
          .eq("is_active", true)
          .order("first_name");
        if (error) throw error;
        setTrainers((data ?? []) as Trainer[]);
      } catch (err: any) {
        toast({
          title: "❌ Error",
          description: err.message || "Could not load trainers list.",
          variant: "destructive",
        });
      } finally {
        setLoadingTrainers(false);
      }
    })();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const start = new Date(form.slot_start);
      const end = new Date(form.slot_end);
      if (start >= end) throw new Error("End time must be after start time.");

      const slots = [];
      if (splitSlots) {
        let cursor = new Date(start);
        while (cursor < end) {
          const next = new Date(Math.min(cursor.getTime() + 60 * 60 * 1000, end.getTime()));
          slots.push({
            trainer_id: form.trainer_id,
            slot_start: cursor.toISOString(),
            slot_end: next.toISOString(),
          });
          cursor = next;
        }
      } else {
        slots.push({
          trainer_id: form.trainer_id,
          slot_start: start.toISOString(),
          slot_end: end.toISOString(),
        });
      }

      const { error } = await supabase.from("slots").insert(slots);
      if (error) throw error;

      const t = trainers.find((t) => t.id === form.trainer_id);
      toast({
        title: "🎉 Slot(s) Added Successfully!",
        description: `${slots.length} slot${slots.length > 1 ? "s" : ""} created for ${t?.first_name} ${t?.last_name}!`,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      setForm({ trainer_id: "", slot_start: "", slot_end: "" });
    } catch (err: any) {
      toast({
        title: "❌ Network Error",
        description: err.message || "Could not create slots.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTrainer = trainers.find((t) => t.id === form.trainer_id);

  const formatDateTime = (s: string) => {
    const d = new Date(s);
    return d.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSlotDuration = () => {
    if (!form.slot_start || !form.slot_end) return "";
    const start = new Date(form.slot_start);
    const end = new Date(form.slot_end);
    const mins = Math.floor((end.getTime() - start.getTime()) / 60000);
    return mins > 0 ? `${mins} minutes` : "";
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-admin to-admin-glow shadow-[var(--shadow-glow)]">
              <Calendar className="w-8 h-8 text-admin-foreground" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Schedule Management
            </h1>
            <Sparkles className="w-8 h-8 text-admin2 animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Create available time slots for your amazing trainers! ⏰
          </p>
        </div>

        {/* Form */}
        <Card className="fitness-card animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center text-2xl">
              <CalendarPlus className="w-6 h-6 text-admin" />
              Add Time Slot
            </CardTitle>
            <CardDescription className="text-base">
              Schedule when your trainers are available for sessions ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trainer */}
              <div className="space-y-3">
                <Label htmlFor="trainer_id" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-admin" /> Select Trainer
                </Label>
                {loadingTrainers ? (
                  <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-xl">
                    <div className="w-4 h-4 border-2 border-admin/30 border-t-admin rounded-full animate-spin" />
                    <span className="text-muted-foreground">
                      Loading trainers...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={form.trainer_id}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, trainer_id: v }))
                    }
                  >
                    <SelectTrigger className="input-fitness h-12">
                      <SelectValue placeholder="Choose an amazing trainer 🏋️‍♂️" />
                    </SelectTrigger>
                    <SelectContent>
                      {trainers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          <div className="flex items-center gap-3 py-1">
                            {t.photo_url && (
                              <img
                                src={t.photo_url}
                                alt={`${t.first_name} ${t.last_name}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {t.first_name} {t.last_name}
                              </div>
                              {t.rating != null && (
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  ⭐ {t.rating}
                                </div>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {selectedTrainer && (
                  <div className="p-3 bg-admin/10 rounded-xl border border-admin/20">
                    <div className="flex items-center gap-3">
                      {selectedTrainer.photo_url && (
                        <img
                          src={selectedTrainer.photo_url}
                          alt={`${selectedTrainer.first_name} ${selectedTrainer.last_name}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-admin">
                          {selectedTrainer.first_name} {selectedTrainer.last_name}
                        </div>
                        {selectedTrainer.rating != null && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-3 h-3 text-yellow-500" />{" "}
                            {selectedTrainer.rating}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slot_start" className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-admin" /> Start Time
                  </Label>
                  <Input
                    id="slot_start"
                    type="datetime-local"
                    value={form.slot_start}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slot_start: e.target.value }))
                    }
                    required
                  />
                  {form.slot_start && (
                    <Badge variant="secondary" className="text-xs">
                      📅 {formatDateTime(form.slot_start)}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slot_end" className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-admin" /> End Time
                  </Label>
                  <Input
                    id="slot_end"
                    type="datetime-local"
                    value={form.slot_end}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slot_end: e.target.value }))
                    }
                    required
                  />
                  {form.slot_end && (
                    <Badge variant="secondary" className="text-xs">
                      🏁 {formatDateTime(form.slot_end)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Split Switch */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={splitSlots}
                  onCheckedChange={setSplitSlots}
                  id="splitSlots"
                />
                <Label htmlFor="splitSlots" className="cursor-pointer">
                  Split into 1-hour slots
                </Label>
              </div>

              {/* Duration */}
              {getSlotDuration() && (
                <div className="p-4 bg-admin2/10 rounded-xl border border-admin2/20">
                  <div className="flex items-center gap-2 justify-center">
                    <Timer className="w-5 h-5 text-admin2" />
                    <span className="font-semibold text-admin2">
                      Session Duration: {getSlotDuration()}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !form.trainer_id ||
                    !form.slot_start ||
                    !form.slot_end
                  }
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-admin-foreground/30 border-t-admin-foreground rounded-full animate-spin" />
                      Creating Schedule...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Create Time Slot! 📅
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {trainers.length > 0 && (
          <Card className="fitness-card animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-admin" />
                  <span className="font-semibold">{trainers.length} Trainers</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-admin" />
                  <span className="font-semibold">Ready to Schedule</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-muted-foreground animate-fade-in">
          <p className="flex items-center justify-center gap-2">
            Time is precious{" "}
            <span className="text-admin2 animate-bounce-gentle">⏰</span> let's use it
            wisely
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSlots;
