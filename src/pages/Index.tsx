import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import card1 from "@/assets/card1.png";
import card2 from "@/assets/card2.png";
import card3 from "@/assets/card3.png";
import card4 from "@/assets/card4.png";

const homeLinks = [
  {
    title: "My Dashboard",
    description: "See upcoming sessions, next workout details, and booking history.",
    href: "/dashboard",
    image: card1,
    label: "Member Dashboard",
    videoUrl: "https://assets.pinterest.com/ext/embed.html?url=https%3A%2F%2Fpin.it%2F1FZei4Lma",
  },
  {
    title: "Trainers",
    description: "Compare coaches by specialty, rating, and training style.",
    href: "/trainers",
    image: card2,
    label: "Personal Training",
  },
  {
    title: "Programs",
    description: "Pick the right intensity, duration, and training goal.",
    href: "/programs",
    image: card3,
    label: "Group Classes",
  },
  {
    title: "Book Session",
    description: "Choose a trainer, program, date, and open time slot.",
    href: "/book",
    image: card4,
    label: "Book Your Session",
  },
];

const woodTexture =
  "https://res.cloudinary.com/ggus-dev/image/private/s--Pp8T8gbI--/c_auto,g_auto,w_400,h_400/v1/25fcf1e9/wood.webp?_a=BAAAV6DQ";

const historyTiles = [
  {
    type: "title",
    heading: "60 Years\nof Serious\nTraining",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    type: "year",
    year: "1938",
    description: "Joe was a self made man, lots of gym equipment were manufactured by himself",
    className: "md:col-span-1",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--by8skP64--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-2-square.webp?_a=BAAAV6DQ",
    className: "md:col-span-1",
  },
  {
    type: "year",
    year: "1942",
    vertical: true,
    className: "md:col-span-1",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--YA54PTW8--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-4.webp?_a=BAAAV6DQ",
    className: "md:col-span-1",
  },
  {
    type: "year",
    year: "1945",
    align: "bottom-right",
    className: "md:col-span-1",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--PoOOS54r--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-6.webp?_a=BAAAV6DQ",
    className: "md:col-span-1",
  },
  {
    type: "text",
    description:
      "After World War II, Joe returns to California to pursue his two passions, weight training and body building.",
    className: "md:col-span-1",
  },
  {
    type: "year",
    year: "1965",
    description: "Joe opens the first Gold's Gym at Venice Beach. A legend is born.",
    className: "md:col-span-1",
  },
  {
    type: "photo",
    image:
      "https://res.cloudinary.com/ggus-dev/image/private/s--vIk0nKIk--/c_auto,g_auto,w_1077,h_1077/v1/25fcf1e9/wood-wall-history-9.webp?_a=BAAAV6DQ",
    className: "md:col-span-1",
  },
  {
    type: "quote",
    quote: '"When I came here, I had no money, Joe let me train in his studio anyway for free."',
    attribution: "Arnold Schwarzenegger",
    className: "md:col-span-1",
  },
  {
    type: "cta",
    heading: "Gold's\nGym\nHistory",
    className: "md:col-span-1",
  },
];

const Index = () => (
  <div>
    <main>
      <Hero />
      <section className="bg-[#080101] py-8 text-white md:py-12">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {historyTiles.map((tile, index) => (
              <div
                key={`${tile.type}-${index}`}
                className={`group relative h-[310px] overflow-hidden ${
                  tile.type === "title" || tile.type === "cta"
                    ? "bg-[#080101]"
                    : "bg-[#e6c999]"
                } p-6 transition duration-300 hover:-translate-y-1 ${
                  tile.className ?? ""
                }`}
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
                    className="absolute inset-0 h-full w-full object-cover sepia transition duration-500 group-hover:scale-105"
                  />
                )}
                {tile.type === "photo" && <div className="absolute inset-0 bg-[#d4ad76]/25 mix-blend-multiply" />}
                <div className="relative z-10 flex h-full flex-col justify-start">
                  {tile.type === "title" && (
                    <p className="whitespace-pre-line text-5xl font-black uppercase leading-[0.95] text-[#d7b98d] md:text-6xl lg:text-7xl">
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
                        <p className="font-serif text-6xl font-black leading-none text-black md:text-7xl">
                          {tile.year}
                        </p>
                      {tile.description && (
                          <p className="mt-8 max-w-[260px] text-2xl font-black leading-tight text-black">
                          {tile.description}
                        </p>
                      )}
                      </div>
                    </div>
                  )}
                  {tile.type === "text" && (
                    <p className="max-w-[300px] text-2xl font-black leading-tight text-black md:text-3xl">
                      {tile.description}
                    </p>
                  )}
                  {tile.type === "quote" && (
                    <blockquote>
                      <p className="text-2xl font-black leading-tight text-black md:text-3xl">{tile.quote}</p>
                      <cite className="mt-5 block text-sm font-bold uppercase tracking-[0.18em] text-black/70">
                        {tile.attribution}
                      </cite>
                    </blockquote>
                  )}
                  {tile.type === "cta" && (
                    <p className="whitespace-pre-line text-5xl font-black uppercase leading-[0.95] text-[#d7b98d] md:text-6xl">
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
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {"videoUrl" in item && item.videoUrl && (
                  <iframe
                    src={item.videoUrl}
                    title={`${item.title} video`}
                    className="pointer-events-none absolute inset-0 z-10 h-full w-full bg-black opacity-0 transition duration-300 group-hover:opacity-100"
                    loading="lazy"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 border border-white/10 transition group-hover:border-primary/70" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="max-w-[12ch] text-4xl font-black uppercase leading-[0.95] text-white drop-shadow-xl md:text-5xl xl:text-[2.65rem]">
                    {item.label}
                  </h3>
                  <div className="mt-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-energy opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
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
