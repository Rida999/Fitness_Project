// src/components/BookingSection.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Trainer = { id: string; first_name: string; last_name: string; headline: string; };
type Program = { id: string; name: string; };
type Slot = { id: string; slot_start: string; slot_end: string; };

export default function BookingSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    trainer: "",
    program: "",
    date: "",
    slotId: "",
    goals: ""
  });
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    supabase
      .from("trainers")
      .select("id, first_name, last_name, headline")
      .eq("is_active", true)
      .order("first_name")
      .then(({ data, error }) => {
        if (error) console.error("Failed to load trainers:", error);
        setTrainers((data ?? []) as Trainer[]);
      });

    supabase
      .from("programs")
      .select("id, name")
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Failed to load programs:", error);
        setPrograms((data ?? []) as Program[]);
      });
  }, []);

  useEffect(() => {
    if (formData.trainer && formData.date) {
      setLoadingSlots(true);
      const start = new Date(`${formData.date}T00:00:00`);
      const end = new Date(`${formData.date}T23:59:59`);

      const loadSlots = async () => {
        try {
          const { data, error } = await supabase
            .from("slots")
            .select("id, slot_start, slot_end")
            .eq("trainer_id", formData.trainer)
            .eq("is_booked", false)
            .gte("slot_start", start.toISOString())
            .lte("slot_start", end.toISOString())
            .order("slot_start");

          if (error) {
            console.error("Failed to load slots:", error);
            setSlots([]);
          } else {
            setSlots((data ?? []) as Slot[]);
          }
        } finally {
          setLoadingSlots(false);
        }
      };

      loadSlots();
    } else {
      setSlots([]);
    }
    setFormData(f => ({ ...f, slotId: "" }));
  }, [formData.trainer, formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trainer || !formData.program || !formData.date || !formData.slotId) {
      toast({ title: "Missing Information", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) throw authError ?? new Error("Please sign in first.");

      const { error } = await supabase.from("bookings").insert({
        user_id: authData.user.id,
        slot_id: formData.slotId,
        program_id: formData.program,
        notes: formData.goals,
      });
      if (error) throw error;

      toast({ title: "Session Booked! 🎉", description: "Your training session is scheduled." });
      setFormData({ trainer: "", program: "", date: "", slotId: "", goals: "" });
      setSlots([]);
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.message || "Error occurred.", variant: "destructive" });
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="booking" className="py-20 bg-gradient-to-br from-primary/5 via-power/5 to-energy/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Book Your Training Session</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to start your fitness journey? Schedule a personalized training session with one of our expert trainers.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Calendar className="h-6 w-6 text-primary" /> Schedule Your Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Choose Trainer *</Label>
                      <Select value={formData.trainer} onValueChange={v => updateFormData("trainer", v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select a trainer" /></SelectTrigger>
                        <SelectContent>
                          {trainers.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              <div>
                                <div className="font-medium">{t.first_name} {t.last_name}</div>
                                <div className="text-sm text-muted-foreground">{t.headline}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Training Program *</Label>
                      <Select value={formData.program} onValueChange={v => updateFormData("program", v)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select a program" /></SelectTrigger>
                        <SelectContent>
                          {programs.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-sm font-semibold">Preferred Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={e => updateFormData("date", e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Available Times *</Label>
                        <Select
                          value={formData.slotId}
                          onValueChange={v => updateFormData("slotId", v)}
                          disabled={loadingSlots || !slots.length}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder={loadingSlots ? "Loading..." : (slots.length ? "Select time" : "Select date/trainer first")} />
                          </SelectTrigger>
                          <SelectContent>
                            {slots.map(s => (
                              <SelectItem key={s.id} value={s.id}>
                                {new Date(s.slot_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="goals" className="text-sm font-semibold">Fitness Goals & Notes</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={e => updateFormData("goals", e.target.value)}
                      placeholder="Tell us about your fitness goals, any injuries, or special requirements..."
                      className="mt-1 min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="text-center pt-4">
                  <Button type="submit" variant="energy" size="lg" className="px-12">
                    <Target className="mr-2 h-5 w-5" /> Book My Session
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
