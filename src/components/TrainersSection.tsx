// src/components/TrainersSection.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Award, Users } from "lucide-react";
import trainerSarah from "@/assets/trainer-sarah.jpg";
import trainerMike from "@/assets/trainer-mike.jpg";

interface TrainerRow {
  id: string;
  first_name: string;
  last_name: string;
  headline: string;
  bio: string;
  rating: number;
  clients_count: number;
  start_date: string | null;
}

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  clients: number;
  image: string;
  certifications: string[];
  description: string;
}

export default function TrainersSection() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const { data, error } = await supabase
          .from("trainers")
          .select("id, first_name, last_name, headline, bio, rating, clients_count, start_date")
          .eq("is_active", true)
          .order("first_name");
        if (error) throw error;

        const placeholderImages = [trainerSarah, trainerMike];
        const mapped: Trainer[] = ((data ?? []) as TrainerRow[]).map((t) => ({
          id: t.id,
          name: `${t.first_name} ${t.last_name}`,
          specialty: t.headline || "",
          experience: t.start_date
            ? `${new Date().getFullYear() - new Date(t.start_date).getFullYear()} years`
            : "",
          rating: t.rating,
          clients: t.clients_count,
          image: placeholderImages[
            Math.floor(Math.random() * placeholderImages.length)
          ],
          certifications: [],
          description: t.bio,
        }));
        setTrainers(mapped);
      } catch (err) {
        console.error("Failed to fetch trainers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <section id="trainers" className="py-20 bg-secondary/30 text-center">
        <p className="text-lg text-muted-foreground">Loading trainers…</p>
      </section>
    );
  }

  return (
    <section id="trainers" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Expert Trainers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Work with certified professionals who are passionate about helping you achieve your fitness goals
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {trainers.map((trainer) => (
            <Card
              key={trainer.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto md:mx-0 border-4 border-primary/20"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{trainer.name}</h3>
                    <p className="text-primary font-semibold mb-3">{trainer.specialty}</p>
                    <p className="text-muted-foreground mb-4">{trainer.description}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-energy fill-current" />
                        <span className="font-semibold">{trainer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-power" />
                        <span className="text-sm">{trainer.clients}+ clients</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-success" />
                        <span className="text-sm">{trainer.experience}</span>
                      </div>
                    </div>
                    <Button variant="power" className="w-full md:w-auto">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book with {trainer.name.split(" ")[0]}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
