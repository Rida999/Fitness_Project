import { Link } from "react-router-dom";
import { Award, Calendar, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TrainersSection from "@/components/TrainersSection";

const Trainers = () => (
  <div className="bg-background">
    <section className="border-b bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Expert Coaching
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-foreground">
            Choose the trainer who fits your goals
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse certified coaches, compare specialties, and book time with the person who can guide your next step.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="energy" size="lg">
              <Link to="/book">
                <Calendar className="mr-2 h-5 w-5" />
                Book with a Trainer
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/programs">Compare Programs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Star className="h-6 w-6 text-energy" />
            <div>
              <h2 className="font-semibold">Rated Coaches</h2>
              <p className="text-sm text-muted-foreground">See ratings and client experience before you choose.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Award className="h-6 w-6 text-success" />
            <div>
              <h2 className="font-semibold">Clear Specialties</h2>
              <p className="text-sm text-muted-foreground">Match with strength, cardio, mobility, or transformation experts.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Users className="h-6 w-6 text-power" />
            <div>
              <h2 className="font-semibold">Personal Fit</h2>
              <p className="text-sm text-muted-foreground">Pick based on coaching style, background, and availability.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <TrainersSection />
  </div>
);

export default Trainers;
