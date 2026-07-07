// src/pages/admin_pages/AdminPrograms.tsx
import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dumbbell,
  Timer,
  Zap,
  Sparkles,
  Plus,
  CheckCircle,
  Clock,
  Activity,
  Target,
} from "lucide-react";

type IntensityOption = {
  value: string;
  label: string;
  color: string;
  icon: string;
};
type IconOption = {
  value: string;
  label: string;
  icon: string;
};

const intensityOptions: IntensityOption[] = [
  { value: "low", label: "Low", color: "bg-green-500", icon: "🟢" },
  { value: "medium", label: "Medium", color: "bg-yellow-500", icon: "🟡" },
  { value: "high", label: "High", color: "bg-orange-500", icon: "🟠" },
  { value: "extreme", label: "Extreme", color: "bg-red-500", icon: "🔴" },
];

const iconOptions: IconOption[] = [
  { value: "dumbbell", label: "Dumbbell", icon: "🏋️" },
  { value: "running", label: "Running", icon: "🏃" },
  { value: "yoga", label: "Yoga", icon: "🧘" },
  { value: "boxing", label: "Boxing", icon: "🥊" },
  { value: "cycling", label: "Cycling", icon: "🚴" },
  { value: "swimming", label: "Swimming", icon: "🏊" },
];

const AdminPrograms: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_min: "",
    duration_max: "",
    intensity: "",
    icon: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...form,
        duration_min: form.duration_min ? Number(form.duration_min) : null,
        duration_max: form.duration_max ? Number(form.duration_max) : null,
      };
      const { error } = await supabase.from("programs").insert(payload);
      if (error) throw error;

      toast({
        title: "🎉 Program Added Successfully!",
        description: `${form.name} has been added to your fitness programs.`,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      setForm({
        name: "",
        description: "",
        duration_min: "",
        duration_max: "",
        intensity: "",
        icon: "",
      });
    } catch (err: any) {
      toast({
        title: "❌ Network Error",
        description: err.message || "Could not create the program.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIntensity = intensityOptions.find(
    (opt) => opt.value === form.intensity
  );
  const selectedIcon = iconOptions.find((opt) => opt.value === form.icon);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-admin to-admin-glow shadow-[var(--shadow-glow)]">
              <Dumbbell className="w-8 h-8 text-admin-foreground" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Fitness Program Creator
            </h1>
            <Sparkles className="w-8 h-8 text-admin2 animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Create amazing workout programs that inspire and motivate! 💪
          </p>
        </div>

        {/* Form */}
        <Card className="fitness-card animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center text-2xl">
              <Plus className="w-6 h-6 text-admin" />
              Add New Program
            </CardTitle>
            <CardDescription>Fill in the details to create an awesome fitness program ✨</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-admin" /> Program Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Energy Boost 🌅"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-admin" /> Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what makes this program special... 🚀"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              {/* Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_min" className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-admin" /> Min (mins)
                  </Label>
                  <Input
                    id="duration_min"
                    type="number"
                    placeholder="15"
                    value={form.duration_min}
                    onChange={(e) =>
                      setForm({ ...form, duration_min: e.target.value })
                    }
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_max" className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-admin" /> Max (mins)
                  </Label>
                  <Input
                    id="duration_max"
                    type="number"
                    placeholder="45"
                    value={form.duration_max}
                    onChange={(e) =>
                      setForm({ ...form, duration_max: e.target.value })
                    }
                    min={1}
                  />
                </div>
              </div>
              {/* Intensity */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-admin" /> Intensity Level
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {intensityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, intensity: opt.value })
                      }
                      className={`p-3 rounded-xl border-2 transition ${
                        form.intensity === opt.value
                          ? "border-admin bg-admin/10 shadow-[var(--shadow-admin)]"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="text-sm">{opt.label}</div>
                    </button>
                  ))}
                </div>
                {selectedIntensity && (
                  <Badge className="mx-auto">
                    Selected: {selectedIntensity.icon}{" "}
                    {selectedIntensity.label}
                  </Badge>
                )}
              </div>
              {/* Icon */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-admin" /> Program Icon
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {iconOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, icon: opt.value })
                      }
                      className={`p-3 rounded-xl border-2 transition ${
                        form.icon === opt.value
                          ? "border-admin bg-admin/10 shadow-[var(--shadow-admin)]"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="text-xs">{opt.label}</div>
                    </button>
                  ))}
                </div>
                {selectedIcon && (
                  <Badge className="mx-auto">
                    Selected: {selectedIcon.icon} {selectedIcon.label}
                  </Badge>
                )}
              </div>
              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !form.name}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-admin-foreground/30 border-t-admin-foreground rounded-full animate-spin" />
                      Creating Magic...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Create Awesome Program! 🚀
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground animate-fade-in">
          <p className="flex items-center justify-center gap-2">
            Made with{" "}
            <span className="text-red-500 animate-bounce-gentle">❤️</span> for
            fitness enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPrograms;
