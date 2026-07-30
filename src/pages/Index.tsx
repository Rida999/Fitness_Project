import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
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

const services = [
  {
    title: "Personal Training",
    detail: "One-on-one coaching, fully focused on your goals, fitness level, and progress.",
    images: [card2, card3, card4],
  },
  {
    title: "Nutrition Guidance",
    detail: "Simple, practical food advice that works in real life. No extremes, just balance.",
    images: [card2, card3, card4],
  },
  {
    title: "Strength & Conditioning",
    detail: "Programs built to improve power, endurance, movement, and long-term performance.",
    images: [card2, card3, card4],
  },
];

const woodTexture =
  "https://res.cloudinary.com/ggus-dev/image/private/s--Pp8T8gbI--/c_auto,g_auto,w_400,h_400/v1/25fcf1e9/wood.webp?_a=BAAAV6DQ";

const reveal = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const fadeOnly = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const revealTransition = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const };

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
              <motion.div
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeOnly}
                transition={{ duration: 0.7, ease: "linear", delay: (index % 4) * 0.04 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            transition={revealTransition}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-energy">
              Navigate Gym Factory
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
              Everything you need, separated into focused pages
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Use Home as your launch point. Open the dashboard to manage your schedule, browse trainers and programs in detail, or go straight to booking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeLinks.map((item, index) => (
              <motion.div
                key={item.href}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={reveal}
                transition={{ ...revealTransition, delay: index * 0.08 }}
              >
              <Link
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#11100e] py-20 text-[#f8f5ef]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              className="lg:sticky lg:top-24 lg:self-start"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={reveal}
              transition={revealTransition}
            >
              <p className="text-sm font-black uppercase tracking-wide text-[#f8f5ef]">
                Our Services
              </p>
              <h2 className="mt-8 max-w-3xl text-5xl font-black uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
                <span className="block font-light text-[#e1b01f]">Not just workouts.</span>
                <span className="block text-[#f8f5ef]">A whole approach.</span>
              </h2>
              <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-[#f8f5ef]/65">
                From personal training to nutrition and recovery, Gym Factory covers what your body truly needs.
              </p>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Link
                  to="/book"
                  className="group/price inline-flex w-fit items-center text-[#11100e]"
                >
                  <span className="flex h-14 min-w-[190px] items-center justify-center whitespace-nowrap rounded-full bg-[#f8f5ef] px-8 text-sm font-black uppercase tracking-wide shadow-[0_14px_34px_rgba(0,0,0,0.2)] transition duration-300 group-hover/price:-translate-y-0.5 sm:min-w-[220px] sm:px-9 sm:text-base">
                    Explore Pricing
                  </span>
                  <span className="ml-1.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f5ef] shadow-[0_14px_34px_rgba(0,0,0,0.2)] transition duration-300 group-hover/price:translate-x-2">
                    <ArrowRight className="h-6 w-6 -rotate-45 transition duration-300 group-hover/price:rotate-0" />
                  </span>
                </Link>
                <Link
                  to="/programs"
                  className="group/video inline-flex w-fit items-center text-[#f8f5ef]"
                >
                  <span className="flex h-14 min-w-[178px] items-center justify-center whitespace-nowrap rounded-full border-2 border-[#f8f5ef] px-8 text-sm font-black uppercase tracking-wide transition duration-300 group-hover/video:-translate-y-0.5 group-hover/video:bg-[#f8f5ef] group-hover/video:text-[#11100e] sm:min-w-[206px] sm:px-9 sm:text-base">
                    Watch Video
                  </span>
                  <span className="ml-1.5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#f8f5ef] transition duration-300 group-hover/video:-translate-y-0.5 group-hover/video:bg-[#f8f5ef] group-hover/video:text-[#11100e]">
                    <Play className="h-4 w-4 fill-current transition duration-300 group-hover/video:scale-110" />
                  </span>
                </Link>
              </div>
            </motion.div>

            <div className="space-y-12 lg:pt-4">
              {services.map((service, index) => {
                const serviceNumber = String(index + 1).padStart(2, "0");
                const chipPosition =
                  index === 0
                    ? {
                        middle: "right-36",
                        top: "right-32",
                        front: "right-[8.75rem]",
                      }
                    : {
                        middle: "right-[10.25rem]",
                        top: "right-[9.75rem]",
                        front: "right-[10rem]",
                      };
                return (
                  <motion.div
                    key={service.title}
                    className="group relative border-b border-[#f8f5ef]/10 px-0 pb-5 pt-8 md:min-h-[220px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={reveal}
                    transition={{ ...revealTransition, delay: index * 0.08 }}
                  >
                    <div className="service-glow-line pointer-events-none absolute -bottom-px left-0 h-[5px] w-full bg-gradient-to-r from-[#e1b01f] via-[#c91f2b] to-[#e1b01f] shadow-[0_0_24px_rgba(225,176,31,0.72)]" />
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
                      <div className="relative z-20 w-fit max-w-xl">
                        <h3 className="text-3xl font-black uppercase text-[#f8f5ef]/75 transition duration-300 group-hover:text-[#f8f5ef] sm:text-4xl">
                          {service.title}
                        </h3>
                        <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-[#f8f5ef]/45 transition duration-300 group-hover:text-[#f8f5ef]/75">
                          {service.detail}
                        </p>
                      </div>
                      <div className="relative min-h-[220px] overflow-hidden md:absolute md:inset-y-0 md:right-0 md:w-[360px]">
                        <span className="absolute right-0 top-6 z-40 font-black leading-none text-[#f8f5ef]/18 transition duration-300 group-hover:text-[#f8f5ef]/95 group-hover:drop-shadow-[0_0_18px_rgba(225,176,31,0.35)] text-[8rem] sm:text-[10rem]">
                          {serviceNumber}
                        </span>
                        <img
                          src={service.images[0]}
                          alt=""
                          className={`absolute ${chipPosition.middle} top-16 z-30 h-[72px] w-32 translate-y-5 rotate-[9deg] rounded-[18px] object-cover opacity-0 shadow-2xl transition duration-700 ease-out group-hover:translate-y-0 group-hover:rotate-[-8deg] group-hover:scale-105 group-hover:opacity-100`}
                        />
                        <img
                          src={service.images[1]}
                          alt=""
                          className={`absolute ${chipPosition.top} top-3 z-10 h-14 w-24 translate-y-5 rotate-[-8deg] rounded-[24px] object-cover opacity-0 shadow-2xl transition duration-700 ease-out group-hover:translate-y-0 group-hover:rotate-[14deg] group-hover:scale-105 group-hover:opacity-100 group-hover:delay-150`}
                        />
                        <img
                          src={service.images[2]}
                          alt=""
                          className={`absolute ${chipPosition.front} top-28 z-50 h-14 w-[86px] translate-y-5 rotate-[14deg] rounded-[20px] object-cover opacity-0 shadow-2xl transition duration-700 ease-out group-hover:translate-y-0 group-hover:rotate-[-12deg] group-hover:scale-105 group-hover:opacity-100 group-hover:delay-300`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default Index;
