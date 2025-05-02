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

      // Enhanced fade effect with color
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const intensity = audioData / 255;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      const bars = 200; // Increased number of bars
      const barWidth = (Math.PI * 2) / bars;

      // Enhanced outer glow with dynamic colors
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        maxRadius * 0.5,
        centerX,
        centerY,
        maxRadius * 1.5
      );
      outerGlow.addColorStop(
        0,
        `hsla(270, 60%, 50%, ${0.15 + intensity * 0.2})`
      );
      outerGlow.addColorStop(
        0.5,
        `hsla(340, 60%, 50%, ${0.1 + intensity * 0.15})`
      );
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(timeRef.current);

      for (let i = 0; i < bars; i++) {
        const angle = i * barWidth;
        const waveEffect = Math.sin(timeRef.current * 2 + i * 0.2) * 0.3;
        const dynamicIntensity = intensity * (1 + waveEffect);
        const barHeight = maxRadius * 0.2 + maxRadius * 0.5 * dynamicIntensity;

        const startRadius =
          maxRadius * (0.8 + Math.sin(timeRef.current + i * 0.1) * 0.15);
        const x1 = Math.cos(angle) * startRadius;
        const y1 = Math.sin(angle) * startRadius;
        const x2 = Math.cos(angle) * (startRadius - barHeight);
        const y2 = Math.sin(angle) * (startRadius - barHeight);

        // Enhanced color transitions
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const progress = (i / bars + timeRef.current * 0.1) % 1;

        if (progress < 0.33) {
          gradient.addColorStop(
            0,
            `hsla(260, 100%, ${70 + intensity * 20}%, ${0.6 + intensity * 0.6})`
          );
          gradient.addColorStop(
            1,
            `hsla(340, 100%, ${80 + intensity * 20}%, ${0.5 + intensity * 0.5})`
          );
        } else if (progress < 0.66) {
          gradient.addColorStop(
            0,
            `hsla(340, 100%, ${60 + intensity * 20}%, ${0.5 + intensity * 0.7})`
          );
          gradient.addColorStop(
            1,
            `hsla(30, 100%, ${70 + intensity * 20}%, ${0.4 + intensity * 0.5})`
          );
        } else {
          gradient.addColorStop(
            0,
            `hsla(30, 100%, ${70 + intensity * 20}%, ${0.5 + intensity * 0.7})`
          );
          gradient.addColorStop(
            1,
            `hsla(270, 60%, ${50 + intensity * 20}%, ${0.4 + intensity * 0.5})`
          );
        }

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4 + intensity * 5;
        ctx.stroke();

        // Enhanced glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor =
          progress < 0.33
            ? "#8a2be2" // Brighter Purple
            : progress < 0.66
            ? "#ff1493" // Brighter Pink
            : "#ff8c00"; // Brighter Orange
      }
      ctx.restore();

      // Enhanced center glow
      const centerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius * 0.6
      );
      centerGlow.addColorStop(
        0,
        `hsla(340, 100%, 60%, ${0.3 + intensity * 0.4})`
      );
      centerGlow.addColorStop(
        0.5,
        `hsla(30, 100%, 60%, ${0.2 + intensity * 0.3})`
      );
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
