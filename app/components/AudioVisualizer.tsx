"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  audioData: number;
  isPlaying: boolean;
}

export default function AudioVisualizer({
  audioData,
  isPlaying,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas || !isPlaying) return;

      timeRef.current += 0.01;

      // Darker fade effect for better contrast
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const intensity = audioData / 255;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.35;
      const bars = 150;
      const barWidth = (Math.PI * 2) / bars;

      // Updated outer glow with GTA VI colors
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        maxRadius * 0.5,
        centerX,
        centerY,
        maxRadius * 1.2
      );
      outerGlow.addColorStop(
        0,
        `hsla(270, 40%, 40%, ${0.1 + intensity * 0.15})`
      ); // Purple
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(timeRef.current);

      for (let i = 0; i < bars; i++) {
        const angle = i * barWidth;
        const waveEffect = Math.sin(timeRef.current * 2 + i * 0.2) * 0.2;
        const dynamicIntensity = intensity * (1 + waveEffect);
        const barHeight = maxRadius * 0.15 + maxRadius * 0.4 * dynamicIntensity;

        const startRadius =
          maxRadius * (0.8 + Math.sin(timeRef.current + i * 0.1) * 0.1);
        const x1 = Math.cos(angle) * startRadius;
        const y1 = Math.sin(angle) * startRadius;
        const x2 = Math.cos(angle) * (startRadius - barHeight);
        const y2 = Math.sin(angle) * (startRadius - barHeight);

        // GTA VI color scheme gradients
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const progress = (i / bars + timeRef.current * 0.1) % 1;

        // Create smooth transition between GTA VI colors
        if (progress < 0.33) {
          // Purple to Pink transition
          gradient.addColorStop(
            0,
            `hsla(260, 100%, ${60 + intensity * 20}%, ${0.5 + intensity * 0.5})`
          );
          gradient.addColorStop(
            1,
            `hsla(340, 100%, ${70 + intensity * 20}%, ${0.4 + intensity * 0.4})`
          );
        } else if (progress < 0.66) {
          // Pink to Orange transition
          gradient.addColorStop(
            0,
            `hsla(340, 100%, ${50 + intensity * 20}%, ${0.4 + intensity * 0.6})`
          );
          gradient.addColorStop(
            1,
            `hsla(30, 100%, ${60 + intensity * 20}%, ${0.3 + intensity * 0.4})`
          );
        } else {
          // Orange to Purple transition
          gradient.addColorStop(
            0,
            `hsla(30, 100%, ${60 + intensity * 20}%, ${0.4 + intensity * 0.6})`
          );
          gradient.addColorStop(
            1,
            `hsla(270, 40%, ${40 + intensity * 20}%, ${0.3 + intensity * 0.4})`
          );
        }

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3 + intensity * 4;
        ctx.stroke();

        // Updated glow effect with color matching
        ctx.shadowBlur = 15;
        ctx.shadowColor =
          progress < 0.33
            ? "#6d4dff" // Brighter Purple
            : progress < 0.66
            ? "#ff2e89" // Brighter Pink
            : "#ffb366"; // Brighter Orange
      }
      ctx.restore();

      // Updated center glow with GTA VI colors
      const centerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius * 0.5
      );
      centerGlow.addColorStop(
        0,
        `hsla(340, 100%, 50%, ${0.2 + intensity * 0.3})`
      ); // Pink center
      centerGlow.addColorStop(
        0.5,
        `hsla(30, 100%, 50%, ${0.1 + intensity * 0.2})`
      ); // Orange mid
      centerGlow.addColorStop(1, "transparent");

      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioData, isPlaying]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPlaying ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    />
  );
}
