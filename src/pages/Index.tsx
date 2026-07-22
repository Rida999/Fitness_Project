import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, ClipboardList, Dumbbell, Timer } from "lucide-react";
import Hero from "@/components/Hero";
import card1 from "@/assets/card1.png";
import card2 from "@/assets/card2.png";
import card3 from "@/assets/card3.png";
import card4 from "@/assets/card4.png";
import gymfactoryVideo from "@/assets/gymfactory.mp4";
import personalTrainingVideo from "@/assets/pt.mp4";
import groupClassesVideo from "@/assets/group_classes.mp4";
import bookSessionVideo from "@/assets/book_session.mp4";

const homeLinks = [
  {
    title: "My Dashboard",
    description: "See upcoming sessions, next workout details, and booking history.",
    href: "/dashboard",
    image: card1,
    label: "Member Dashboard",
    video: gymfactoryVideo,
    textOffset: "translate-y-20 group-hover:translate-y-0",
  },
  {
    title: "Trainers",
    description: "Compare coaches by specialty, rating, and training style.",
    href: "/trainers",
    image: card2,
    label: "Personal Training",
    video: personalTrainingVideo,
  },
  {
    title: "Programs",
    description: "Pick the right intensity, duration, and training goal.",
    href: "/programs",
    image: card3,
    label: "Select Program",
    video: groupClassesVideo,
  },
  {
    title: "Book Session",
    description: "Choose a trainer, program, date, and open time slot.",
    href: "/book",
    image: card4,
    label: "Book Your Session",
    video: bookSessionVideo,
  },
];

const planningSteps = [
  {
    title: "Set Your Goal",
    detail: "Choose strength, conditioning, mobility, or a full-body session.",
    icon: ClipboardList,
  },
  {
    title: "Match The Coach",
    detail: "Compare trainers by specialty, style, and the plan you want to follow.",
    icon: Dumbbell,
  },
  {
    title: "Lock The Time",
    detail: "Reserve an open slot and keep your upcoming workout ready in your dashboard.",
    icon: CalendarCheck,
  },
];

const woodTexture =
  "https://res.cloudinary.com/ggus-dev/image/private/s--Pp8T8gbI--/c_auto,g_auto,w_400,h_400/v1/25fcf1e9/wood.webp?_a=BAAAV6DQ";

const historyTiles = [
  {
    type: "title",
    heading: "60 Years\nof Serious\nTraining",
  },
  {
    type: "year",
    year: "1938",
    description: "Joe was a self made man, lots of gym equipment were manufactured by himself",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--by8skP64--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-2-square.webp?_a=BAAAV6DQ",
  },
  {
    type: "year",
    year: "1942",
    vertical: true,
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--YA54PTW8--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-4.webp?_a=BAAAV6DQ",
  },
  {
    type: "year",
    year: "1945",
    align: "bottom-right",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--PoOOS54r--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-6.webp?_a=BAAAV6DQ",
  },
  {
    type: "text",
    description:
      "After World War II, Joe returns to California to pursue his two passions, weight training and body building.",
  },
  {
    type: "year",
    year: "1965",
    description: "Joe opens the first Gold's Gym at Venice Beach. A legend is born.",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--vIk0nKIk--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-9.webp?_a=BAAAV6DQ",
  },
  {
    type: "quote",
    quote: '"When I came here, I had no money, Joe let me train in his studio anyway for free."',
    attribution: "Arnold Schwarzenegger",
  },
  {
    type: "cta",
    heading: "Gold's\nGym\nHistory",
  },
];

const Index = () => (
  <div>
    <main>
      <Hero />
      <section className="bg-[#080101] pb-2 pt-8 text-white md:pb-3 md:pt-12">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {historyTiles.map((tile, index) => (
              <div
                key={`${tile.type}-${index}`}
                className={`group relative aspect-square overflow-hidden ${
                  tile.type === "title" || tile.type === "cta"
                    ? "bg-[#080101]"
                    : "bg-[#e6c999]"
                } p-3 transition duration-300 hover:-translate-y-1 sm:p-4 lg:p-6`}
                style={
                  tile.type !== "photo" && tile.type !== "title" && tile.type !== "cta"
                    ? { backgroundImage: `url(${woodTexture})` }
                    : undefined
                }
              >
                {"image" in tile && tile.image && (
                  <img
                    src={tile.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain sepia transition duration-500 group-hover:scale-105"
                  />
                )}
                {tile.type === "photo" && <div className="absolute inset-0 bg-[#d4ad76]/25 mix-blend-multiply" />}
                <div className="relative z-10 flex h-full flex-col justify-start">
                  {tile.type === "title" && (
                    <p className="whitespace-pre-line text-[clamp(2rem,9vw,4.5rem)] font-black uppercase leading-[0.92] text-[#d7b98d] md:text-[clamp(2.25rem,4vw,4.5rem)]">
                      {tile.heading}
                    </p>
                  )}
                  {tile.type === "year" && (
                    <div
                      className={`flex h-full ${
                        tile.align === "bottom-right"
                          ? "items-end justify-end"
                          : tile.vertical
                            ? "items-start justify-end"
                            : "items-start justify-start"
                      }`}
                    >
                      <div className={tile.vertical ? "origin-top-right rotate-90" : ""}>
                        <p className="font-serif text-[clamp(2.5rem,12vw,4.75rem)] font-black leading-none text-black md:text-[clamp(3rem,5vw,4.75rem)]">
                          {tile.year}
                        </p>
                      {tile.description && (
                          <p className="mt-4 max-w-[22ch] text-[clamp(0.9rem,3.6vw,1.65rem)] font-black leading-tight text-black md:text-[clamp(1rem,1.7vw,1.65rem)]">
                          {tile.description}
                        </p>
                      )}
                      </div>
                    </div>
                  )}
                  {tile.type === "text" && (
                    <p className="max-w-[24ch] text-[clamp(0.95rem,3.8vw,1.75rem)] font-black leading-tight text-black md:text-[clamp(1rem,1.9vw,1.8rem)]">
                      {tile.description}
                    </p>
                  )}
                  {tile.type === "quote" && (
                    <blockquote>
                      <p className="text-[clamp(0.95rem,3.8vw,1.7rem)] font-black leading-tight text-black md:text-[clamp(1rem,1.8vw,1.75rem)]">
                        {tile.quote}
                      </p>
                      <cite className="mt-3 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/70 sm:text-xs">
                        {tile.attribution}
                      </cite>
                    </blockquote>
                  )}
                  {tile.type === "cta" && (
                    <p className="whitespace-pre-line text-[clamp(2rem,9vw,4rem)] font-black uppercase leading-[0.92] text-[#d7b98d] md:text-[clamp(2.25rem,4vw,4rem)]">
                      {tile.heading}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-energy">
              Navigate Gym Factory
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
              Everything you need, separated into focused pages
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Use Home as your launch point. Open the dashboard to manage your schedule, browse trainers and programs in detail, or go straight to booking.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-label={`${item.title}: ${item.description}`}
                className="group relative block h-[430px] overflow-hidden bg-black shadow-2xl shadow-black/35 outline-none transition duration-300 hover:-translate-y-1 hover:shadow-primary/35 focus-visible:ring-2 focus-visible:ring-energy"
                onMouseEnter={(event) => {
                  const video = event.currentTarget.querySelector("video");
                  if (!video) return;
                  video.currentTime = 0;
                  void video.play();
                }}
                onMouseLeave={(event) => {
                  const video = event.currentTarget.querySelector("video");
                  if (!video) return;
                  video.pause();
                  video.currentTime = 0;
                }}
                onFocus={(event) => {
                  const video = event.currentTarget.querySelector("video");
                  if (!video) return;
                  video.currentTime = 0;
                  void video.play();
                }}
                onBlur={(event) => {
                  const video = event.currentTarget.querySelector("video");
                  if (!video) return;
                  video.pause();
                  video.currentTime = 0;
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <video
                  src={item.video}
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 border border-white/10 transition group-hover:border-primary/70" />
                <div
                  className={`absolute inset-x-0 bottom-0 z-20 p-6 text-center transition duration-300 ${
                    item.textOffset ?? "translate-y-14 group-hover:translate-y-0"
                  }`}
                >
                  <h3 className="mx-auto max-w-[12ch] text-4xl font-black uppercase leading-[0.95] text-white drop-shadow-xl md:text-5xl xl:text-[2.65rem]">
                    {item.label}
                  </h3>
                  <p className="mx-auto mt-4 max-w-[24ch] text-sm font-semibold leading-relaxed text-white/90 opacity-0 drop-shadow-lg transition duration-300 group-hover:opacity-100">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f3ee] py-20 text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Your Training Plan
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-black uppercase leading-none sm:text-5xl">
                Plan it clean. Train it hard.
              </h2>
              <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-muted-foreground">
                Build the day around your goal, match with the right coach, and reserve a session that already feels organized before you arrive.
              </p>

              <div className="relative mt-8 overflow-hidden bg-white p-5 shadow-2xl shadow-primary/10 sm:p-6">
                <div className="absolute right-0 top-0 h-20 w-20 bg-energy" />
                <div className="absolute right-5 top-5 h-20 w-20 bg-primary" />
                <div className="relative grid gap-3 sm:grid-cols-2">
                  <div className="border border-primary/15 bg-[#fff8ea] p-4">
                    <Timer className="mb-4 h-6 w-6 text-primary" />
                    <p className="text-3xl font-black text-primary">45-90</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Minute Sessions
                    </p>
                  </div>
                  <div className="border border-energy/40 bg-energy p-4 text-black">
                    <CalendarCheck className="mb-4 h-6 w-6" />
                    <p className="text-3xl font-black">Live</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-black/70">
                      Slot Booking
                    </p>
                  </div>
                </div>

                <div className="relative mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black uppercase tracking-wide">
                  <span className="bg-primary px-2 py-3 text-white">Goal</span>
                  <span className="bg-black px-2 py-3 text-white">Coach</span>
                  <span className="bg-energy px-2 py-3 text-black">Time</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center bg-primary px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-primary/90"
                >
                  Start Planning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/trainers"
                  className="inline-flex items-center justify-center border border-energy bg-energy px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-energy/90"
                >
                  View Coaches
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-8 hidden h-[calc(100%-4rem)] w-1 bg-primary/20 lg:block" />
              <div className="space-y-4">
              {planningSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="group grid grid-cols-[56px_1fr] gap-4 bg-white p-4 shadow-lg shadow-black/5 transition hover:-translate-x-1 hover:shadow-primary/15 sm:grid-cols-[72px_1fr] sm:p-5"
                  >
                    <div className="flex h-14 w-14 items-center justify-center bg-energy text-black transition group-hover:bg-primary group-hover:text-white sm:h-16 sm:w-16">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-4xl font-black leading-none text-primary">
                          0{index + 1}
                        </span>
                        <h3 className="text-xl font-black uppercase text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default Index;
