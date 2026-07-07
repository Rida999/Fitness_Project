import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-gym.jpg";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  const openVideo = () => setShowVideo(true);
  const closeVideo = () => setShowVideo(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-power/70 to-primary/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="block bg-gradient-to-r from-energy to-yellow-400 bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Book personalized training sessions with certified professionals. 
            Achieve your fitness goals with expert guidance and motivation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              variant="energy"
              size="lg"
              className="text-lg px-8 py-4 h-auto"
            >
              <Link to="/book">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Session
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={openVideo}
              className="group text-lg px-8 py-4 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Expert Trainers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-white/80">Programs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Video Modal with Framer Motion */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.div
              className="relative w-full max-w-3xl aspect-video"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }, // backOut
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.2, ease: "easeInOut" },
              }}
            >
              <iframe
                className="w-full h-full rounded-md shadow-2xl"
                src="https://www.youtube.com/embed/bw6jZ68AXn0?autoplay=1"
                title="Demo Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <button
                className="absolute top-4 right-4 text-white text-3xl"
                onClick={closeVideo}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
