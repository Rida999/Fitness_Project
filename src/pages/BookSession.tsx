import { Link } from "react-router-dom";
import { CalendarCheck, ClipboardList, Dumbbell, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BookingSection from "@/components/BookingSection";

const BookSession = () => (
  <div className="bg-background">
    <section className="border-b bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Schedule
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-foreground">
            Book your next training session
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Select a trainer, choose the program, pick an available slot, and add notes so your coach knows what to focus on.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">View My Schedule</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/trainers">Browse Trainers</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <UserCheck className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-semibold">1. Choose Trainer</h2>
              <p className="text-sm text-muted-foreground">Pick the expert whose schedule and specialty match your needs.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <Dumbbell className="h-6 w-6 text-power" />
            <div>
              <h2 className="font-semibold">2. Select Program</h2>
              <p className="text-sm text-muted-foreground">Attach a structured training focus to the session.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex gap-4">
            <CalendarCheck className="h-6 w-6 text-success" />
            <div>
              <h2 className="font-semibold">3. Confirm Time</h2>
              <p className="text-sm text-muted-foreground">Reserve an open slot and track it from your dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <BookingSection />

    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardContent className="pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <ClipboardList className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-semibold">Need to change plans?</h2>
              <p className="text-sm text-muted-foreground">Your dashboard lets you review upcoming sessions and cancel when needed.</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link to="/dashboard">Open Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  </div>
);

export default BookSession;
