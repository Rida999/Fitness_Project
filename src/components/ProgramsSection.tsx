// src/components/ProgramsSection.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Heart, Target, Zap, Users, Clock, TrendingUp, Flame } from "lucide-react";

const intensityStyles: Record<string, { color: string; bg: string }> = {
  "Very High": { color: "text-red-700", bg: "bg-red-100" },
  High:         { color: "text-orange-700", bg: "bg-orange-100" },
  Medium:       { color: "text-blue-700", bg: "bg-blue-100" },
  Variable:     { color: "text-green-700", bg: "bg-green-100" },
};

const placeholderIcons = [Dumbbell, Zap, Heart, Target, TrendingUp, Flame];
const placeholderLogoStyles = [
  { color: "text-primary", bg: "bg-primary/10" },
  { color: "text-energy",  bg: "bg-energy/10"  },
  { color: "text-power",   bg: "bg-power/10"   },
  { color: "text-success", bg: "bg-success/10" },
];

interface ProgramRow {
  id: string;
  name: string;
  description: string;
  duration_min: number;
  duration_max: number;
  intensity: string;
  icon: string;
  features?: string[];
}

interface Program extends ProgramRow {
  duration: string;
  IconComponent: React.ComponentType<any>;
  logoStyle: { color: string; bg: string };
  intensityStyle: { color: string; bg: string };
}

export default function ProgramsSection() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const { data, error } = await supabase
          .from("programs")
          .select("id, name, description, duration_min, duration_max, intensity, icon, features")
          .eq("is_active", true)
          .order("name");
        if (error) throw error;

        const mapped: Program[] = ((data ?? []) as ProgramRow[]).map((p) => {
          const IconComponent = placeholderIcons[Math.floor(Math.random() * placeholderIcons.length)];
          const logoStyle = placeholderLogoStyles[Math.floor(Math.random() * placeholderLogoStyles.length)];
          return {
            ...p,
            duration:
              p.duration_min === p.duration_max
                ? `${p.duration_min} min`
                : `${p.duration_min}-${p.duration_max} min`,
            IconComponent,
            logoStyle,
            intensityStyle: intensityStyles[p.intensity] || intensityStyles.Variable,
          };
        });
        setPrograms(mapped);
      } catch (err) {
        console.error("Failed to load programs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <section id="programs" className="py-20 bg-background text-center">
        <p className="text-lg text-muted-foreground">Loading programs…</p>
      </section>
    );
  }

  return (
    <section id="programs" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Training Programs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our diverse range of training programs designed to meet your specific fitness goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog) => (
            <Card key={prog.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div
                  className={`w-16 h-16 rounded-full ${prog.logoStyle.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <prog.IconComponent className={`h-8 w-8 ${prog.logoStyle.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">{prog.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{prog.description}</p>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{prog.duration}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${prog.intensityStyle.bg} ${prog.intensityStyle.color}`}
                  >
                    {prog.intensity}
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {prog.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full transition group-hover:border-orange-500 group-hover:text-orange-500 hover:!bg-green-600 hover:!text-white hover:!border-white"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="energy" size="lg">
            <Users className="mr-2 h-5 w-5" />
            Book a Consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
