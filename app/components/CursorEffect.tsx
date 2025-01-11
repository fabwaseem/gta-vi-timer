"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const CursorEffect = ({ audioData }: { audioData: number }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-screen"
      animate={{
        x: mousePos.x - 12,
        y: mousePos.y - 12,
        transition: {
          type: "spring",
          damping: 15,
          stiffness: 150,
          mass: 0.1,
        },
      }}
      style={{
        background: `radial-gradient(circle, rgba(255,179,102,${
          0.5 + (audioData / 255) * 5
        }) 0%, rgba(255,179,102,0) 70%)`,
        boxShadow: `0 0 ${10 + (audioData / 255) * 20}px rgba(255,179,102,${
          0.4 + (audioData / 255) * 1
        })`,
      }}
    />
  );
};
