// src/pages/admin_pages/ViewTrainers.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Star,
  Calendar,
  Clock,
  Dumbbell,
  ArrowLeft,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
  Timer,
  UserCheck,
  Activity,
} from "lucide-react";

interface Trainer {
  id: string;
  first_name: string;
  last_name: string;
  photo_url?: string;
  headline?: string;
  bio?: string;
  rating?: number;
  clients_count?: number;
  start_date?: string;
  is_active: boolean;
}

interface Slot {
  id: string;
  trainer_id: string;
  slot_start: string;
  slot_end: string;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  duration_min?: number;
  duration_max?: number;
  intensity?: string;
  icon?: string;
}

const ViewTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [tRes, sRes, pRes] = await Promise.all([
          supabase.from("trainers").select("*").order("first_name"),
          supabase.from("slots").select("id, trainer_id, slot_start, slot_end").order("slot_start"),
          supabase.from("programs").select("*").order("name"),
        ]);
        if (tRes.error) throw tRes.error;
        if (sRes.error) throw sRes.error;
        if (pRes.error) throw pRes.error;
        setTrainers((tRes.data ?? []) as Trainer[]);
        setSlots((sRes.data ?? []) as Slot[]);
        setPrograms((pRes.data ?? []) as Program[]);
      } catch (err: any) {
        toast({
          title: "❌ Error",
          description: err.message || "Could not load data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const getTrainerSlots = (trainerId: string) =>
    slots.filter((slot) => slot.trainer_id === trainerId);

  const formatDateTime = (s: string) =>
    new Date(s).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getIntensityColor = (intensity?: string) => {
    switch (intensity?.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "extreme":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-admin/30 border-t-admin rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-lg">
            Loading amazing trainers... 🏋️‍♂️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-admin to-admin-glow shadow-[var(--shadow-glow)]">
              <Users className="w-8 h-8 text-admin-foreground" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Our Amazing Trainers
            </h1>
            <Sparkles className="w-8 h-8 text-admin2 animate-pulse-glow" />
          </div>
          <p className="text-muted-foreground text-lg">
            Meet your fitness dream team with their schedules and specialties! 💪
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-admin" />
                <span className="text-2xl font-bold gradient-text">
                  {trainers.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Total Trainers</p>
            </CardContent>
          </Card>
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {trainers.filter((t) => t.is_active).length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Active Trainers</p>
            </CardContent>
          </Card>
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-admin2" />
                <span className="text-2xl font-bold text-admin2">
                  {slots.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Total Slots</p>
            </CardContent>
          </Card>
          <Card className="fitness-card text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Dumbbell className="w-5 h-5 text-secondary-foreground" />
                <span className="text-2xl font-bold text-secondary-foreground">
                  {programs.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Programs Available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trainers.map((trainer, i) => {
            const trainerSlots = getTrainerSlots(trainer.id);
            return (
              <Card
                key={trainer.id}
                className="fitness-card animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      {trainer.photo_url ? (
                        <AvatarImage
                          src={trainer.photo_url}
                          alt={`${trainer.first_name} ${trainer.last_name}`}
                        />
                      ) : (
                        <AvatarFallback className="bg-admin text-admin-foreground font-bold text-lg">
                          {trainer.first_name[0]}
                          {trainer.last_name[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {trainer.first_name} {trainer.last_name}
                        {trainer.is_active ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Heart className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      {trainer.headline && (
                        <CardDescription className="text-base font-medium">
                          {trainer.headline}
                        </CardDescription>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        {trainer.rating != null && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            <span className="font-semibold">
                              {trainer.rating}
                            </span>
                          </div>
                        )}
                        {trainer.clients_count != null && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-admin" />
                            <span className="text-sm text-muted-foreground">
                              {trainer.clients_count} clients
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trainer.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {trainer.bio}
                    </p>
                  )}
                  {/* Schedule */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-admin" />
                      <h4 className="font-semibold">
                        Schedule ({trainerSlots.length} slots)
                      </h4>
                    </div>
                    {trainerSlots.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {trainerSlots.slice(0, 3).map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                          >
                            <Clock className="w-3 h-3 text-admin2" />
                            <span className="text-xs">
                              {formatDateTime(slot.slot_start)} →{" "}
                              {formatDateTime(slot.slot_end)}
                            </span>
                          </div>
                        ))}
                        {trainerSlots.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{trainerSlots.length - 3} more slots
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No scheduled slots yet
                      </p>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/admin/trainers")}
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate("/admin/slots")}
                    >
                      <Timer className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Programs Overview */}
        {programs.length > 0 && (
          <Card className="fitness-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-admin" />
                Available Programs
                <Badge variant="secondary">{programs.length} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{p.icon || "💪"}</span>
                      <h5 className="font-semibold">{p.name}</h5>
                    </div>
                    {p.intensity && (
                      <Badge className={getIntensityColor(p.intensity)}>
                        {p.intensity}
                      </Badge>
                    )}
                    {p.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {programs.length > 6 && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/programs")}
                  >
                    View All Programs ({programs.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {trainers.length === 0 && (
          <Card className="fitness-card text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Trainers Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your amazing fitness team!
              </p>
              <Button onClick={() => navigate("/admin/trainers")}>
                Add First Trainer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewTrainers;
