"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CursorEffect = ({ audioData }: { audioData: number }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<
    Array<{ x: number; y: number; opacity: number }>
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setTrail((prev) => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, opacity: 1 }];
        return newTrail.slice(-5); // Keep last 5 positions
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update trail opacity
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((pos) => ({
            ...pos,
            opacity: Math.max(0, pos.opacity - 0.1),
          }))
          .filter((pos) => pos.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const intensity = audioData / 255;
  const size = 8 + intensity * 12;
  const glowSize = 15 + intensity * 25;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed rounded-full pointer-events-none z-50 mix-blend-screen"
        animate={{
          x: mousePos.x - size / 2,
          y: mousePos.y - size / 2,
          width: size,
          height: size,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 150,
            mass: 0.1,
          },
        }}
        style={{
          background: `radial-gradient(circle, rgba(255,179,102,${
            0.6 + intensity * 0.8
          }) 0%, rgba(255,179,102,0) 70%)`,
          boxShadow: `0 0 ${glowSize}px rgba(255,179,102,${
            0.5 + intensity * 0.5
          })`,
        }}
      />

      {/* Cursor trail */}
      {trail.map((pos, index) => (
        <motion.div
          key={index}
          className="fixed rounded-full pointer-events-none z-40 mix-blend-screen"
          animate={{
            x: pos.x - size / 2,
            y: pos.y - size / 2,
            width: size * (0.8 - index * 0.1),
            height: size * (0.8 - index * 0.1),
          }}
          style={{
            background: `radial-gradient(circle, rgba(255,179,102,${
              pos.opacity * (0.4 + intensity * 0.4)
            }) 0%, rgba(255,179,102,0) 70%)`,
            boxShadow: `0 0 ${glowSize * 0.8}px rgba(255,179,102,${
              pos.opacity * (0.3 + intensity * 0.3)
            })`,
          }}
        />
      ))}
    </>
  );
};
