// src/pages/admin_pages/AdminTrainers.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Star,
  User,
  Camera,
  Briefcase,
  FileText,
  Calendar,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Heart,
  Award,
  UserPlus,
} from "lucide-react";

const AdminTrainers: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    photo_url: "",
    headline: "",
    bio: "",
    rating: "",
    clients_count: "",
    start_date: "",
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Display stars/half stars based on rating
  const getRatingDisplay = () => {
    const r = parseFloat(form.rating);
    if (isNaN(r) || r <= 0) return "";
    const full = Math.floor(r);
    const half = r % 1 >= 0.5;
    return "⭐".repeat(full) + (half ? "✨" : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : undefined,
        clients_count: form.clients_count ? parseInt(form.clients_count, 10) : undefined,
        start_date: form.start_date || null,
      };
      const { error } = await supabase.from("trainers").insert(payload);
      if (error) throw error;

      toast({
        title: "🎉 Trainer Added Successfully!",
        description: `${form.first_name} ${form.last_name} is now part of your amazing team!`,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      setForm({
        first_name: "",
        last_name: "",
        photo_url: "",
        headline: "",
        bio: "",
        rating: "",
        clients_count: "",
        start_date: "",
        is_active: true,
      });
    } catch (err: any) {
      toast({
        title: "❌ Network Error",
        description: err.message || "Could not create the trainer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-admin to-admin-glow shadow-[var(--shadow-glow)]">
              <Users className="w-8 h-8 text-admin-foreground" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Trainer Management
            </h1>
            <Sparkles className="w-8 h-8 text-admin2 animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Add amazing trainers to your fitness team! 🏋️‍♂️
          </p>
        </div>

        {/* Form */}
        <Card className="fitness-card animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center gap-2 justify-center text-2xl">
              <UserPlus className="w-6 h-6 text-admin" />
              Add New Trainer
            </CardTitle>
            <CardDescription className="text-base">
              Build your dream team of fitness professionals ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["first_name", "last_name"].map((field, idx) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="flex items-center gap-2">
                      <User className="w-4 h-4 text-admin" />
                      {field === "first_name" ? "First Name" : "Last Name"}
                    </Label>
                    <Input
                      id={field}
                      placeholder={
                        field === "first_name" ? "e.g., Alex 💪" : "e.g., Johnson 🚀"
                      }
                      value={(form as any)[field]}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          [field]: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Photo URL */}
              <div className="space-y-2">
                <Label htmlFor="photo_url" className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-admin" />
                  Profile Photo URL
                </Label>
                <Input
                  id="photo_url"
                  type="url"
                  placeholder="https://...trainer.jpg 📸"
                  value={form.photo_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, photo_url: e.target.value }))
                  }
                />
                {form.photo_url && (
                  <div className="mt-2 p-2 bg-muted rounded-lg">
                    <img
                      src={form.photo_url}
                      alt="Trainer preview"
                      className="w-16 h-16 rounded-full mx-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Headline & Bio */}
              <div className="space-y-2">
                <Label htmlFor="headline" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-admin" />
                  Professional Headline
                </Label>
                <Input
                  id="headline"
                  placeholder="Certified Personal Trainer & Nutrition Expert 🏆"
                  value={form.headline}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, headline: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-admin" />
                  Biography
                </Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Background, specialties, passion... 🌟"
                  value={form.bio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bio: e.target.value }))
                  }
                />
              </div>

              {/* Rating, Clients, Start Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating" className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-admin" />
                    Rating
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.8"
                    value={form.rating}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, rating: e.target.value }))
                    }
                  />
                  {!!form.rating && (
                    <div className="text-sm">{getRatingDisplay()}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="clients_count"
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-admin" />
                    Clients Count
                  </Label>
                  <Input
                    id="clients_count"
                    type="number"
                    min="0"
                    placeholder="150"
                    value={form.clients_count}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, clients_count: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-admin" />
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, start_date: e.target.value }))
                    }
                  />
                </div>
              </div>

              {/* Active */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      form.is_active ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        form.is_active ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="is_active">Active Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {form.is_active
                        ? "Trainer is actively accepting clients"
                        : "Trainer is currently inactive"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, is_active: v }))
                  }
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !form.first_name.trim() ||
                    !form.last_name.trim()
                  }
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-admin-foreground/30 border-t-admin-foreground rounded-full animate-spin" />
                      Adding to Team...
                    </div>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      Add Amazing Trainer! 🌟
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
            Building the best fitness team{" "}
            <span className="text-admin animate-bounce-gentle">💪</span> together
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminTrainers;
