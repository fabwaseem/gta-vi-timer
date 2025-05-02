"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface CountdownDisplayProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  audioData: number;
}

export default function CountdownDisplay({
  timeLeft,
  audioData,
}: CountdownDisplayProps) {
  const [isHovered, setIsHovered] = useState(false);
  const intensity = audioData / 255;

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          className="timer-box p-6 rounded-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: `0 0 ${15 + intensity * 30}px rgba(255, 46, 137, ${
              0.3 + intensity * 0.5
            })`,
          }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
          }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(45deg,
                rgba(255, 46, 137, ${0.2 + intensity * 0.3}) 0%,
                rgba(255, 179, 102, ${0.1 + intensity * 0.2}) 100%
              )`,
            }}
          />

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `linear-gradient(45deg,
                rgba(255, 46, 137, ${0.5 + intensity * 0.5}) 0%,
                rgba(255, 179, 102, ${0.3 + intensity * 0.4}) 100%
              )`,
            }}
            animate={{
              opacity: isHovered ? [0.5, 1, 0.5] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              className="text-4xl md:text-5xl font-bold font-orbitron text-[#ff2e89]"
              animate={{
                scale: isHovered ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {unit.value.toString().padStart(2, "0")}
            </motion.div>
            <motion.div
              className="text-sm uppercase mt-2 font-press-start text-white/80"
              animate={{
                opacity: isHovered ? [0.8, 1, 0.8] : 0.8,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {unit.label}
            </motion.div>
          </div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: `inset 0 0 ${
                20 + intensity * 40
              }px rgba(255, 46, 137, ${0.2 + intensity * 0.3})`,
            }}
            animate={{
              opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
