import React, { useEffect, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

export const AnimatedTestimonials = ({
  testimonials = [], // Default to an empty array if undefined
  autoplay = false,
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="max-w-6xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex justify-center md:col-span-1">
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 999 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-lg"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-6 p-6 bg-white shadow-lg rounded-xl md:col-span-2 max-w-full">
          {testimonials.length > 0 && (
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-2xl font-bold text-gray-800">
                {testimonials[active].name}
              </h3>
              <p className="text-sm text-gray-500">
                {testimonials[active].designation}
              </p>
              <motion.p className="text-lg text-gray-600 mt-8">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          )}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handlePrev}
              className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center group"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-700 group-hover:rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center group"
            >
              <IconArrowRight className="h-5 w-5 text-gray-700 group-hover:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};