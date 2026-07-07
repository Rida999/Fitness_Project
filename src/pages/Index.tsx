import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Dumbbell, LayoutDashboard, Users } from "lucide-react";
import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const homeLinks = [
  {
    title: "My Dashboard",
    description: "See upcoming sessions, next workout details, and booking history.",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-power",
    bg: "bg-power/10",
  },
  {
    title: "Trainers",
    description: "Compare coaches by specialty, rating, and training style.",
    href: "/trainers",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Programs",
    description: "Pick the right intensity, duration, and training goal.",
    href: "/programs",
    icon: Dumbbell,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Book Session",
    description: "Choose a trainer, program, date, and open time slot.",
    href: "/book",
    icon: Calendar,
    color: "text-energy",
    bg: "bg-energy/10",
  },
];

const Index = () => (
  <div>
    <main>
      <Hero />
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Navigate Gym Factory
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
              Everything you need, separated into focused pages
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Use Home as your launch point. Open the dashboard to manage your schedule, browse trainers and programs in detail, or go straight to booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {homeLinks.map((item) => (
              <Card key={item.href} className="group hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className={`h-12 w-12 rounded-full ${item.bg} flex items-center justify-center mb-5`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground min-h-[60px]">
                    {item.description}
                  </p>
                  <Button asChild variant="outline" className="mt-5 w-full group-hover:border-primary group-hover:text-primary">
                    <Link to={item.href}>
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                How it works
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">
                A cleaner path from goal to booked session
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start by checking your dashboard, choose the coach and program that fit the day, then book a time that becomes part of your schedule.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Choose trainer", "Pick program", "Reserve slot"].map((step, index) => (
                <div key={step} className="rounded-lg border bg-card p-5">
                  <div className="text-3xl font-bold text-primary">0{index + 1}</div>
                  <div className="mt-3 font-semibold">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default Index;
