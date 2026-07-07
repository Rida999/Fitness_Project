import { Link } from "react-router-dom";
import { Activity, Clock, Dumbbell, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgramsSection from "@/components/ProgramsSection";

const Programs = () => (
  <div className="bg-background">
    <section className="border-b bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Training Paths
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-foreground">
            Find the program that gives your training structure
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore sessions by intensity, duration, and goal so every booking has a clear purpose.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="energy" size="lg">
              <Link to="/book">
                <Dumbbell className="mr-2 h-5 w-5" />
                Book a Program
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/trainers">Meet Trainers</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-semibold">Goal Based</h2>
              <p className="text-sm text-muted-foreground">Choose programs for strength, fat loss, endurance, or mobility.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Clock className="h-6 w-6 text-power" />
            <div>
              <h2 className="font-semibold">Time Aware</h2>
              <p className="text-sm text-muted-foreground">Compare durations before committing to a session.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Activity className="h-6 w-6 text-success" />
            <div>
              <h2 className="font-semibold">Intensity Match</h2>
              <p className="text-sm text-muted-foreground">Pick the level that suits your energy and experience.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <ProgramsSection />
  </div>
);

export default Programs;
