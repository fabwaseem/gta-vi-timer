"use client";

import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { motion } from "framer-motion";
import {
  Info,
  Pause,
  Play,
  Share2,
  Youtube
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AudioVisualizer from "./components/AudioVisualizer";
import { CursorEffect } from "./components/CursorEffect";
import SettingsPanel from "./components/SettingsPanel";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [daysSinceTrailer, setDaysSinceTrailer] = useState(0);

  const trailerDate = new Date("2023-12-05");
  const targetDate = new Date("2026-05-26");

  const [audioData, setAudioData] = useState<number>(0);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  // Add particle effect state
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      speedX: number;
      speedY: number;
    }>
  >([]);

  const [showInfo, setShowInfo] = useState(false);

  const setupAudioContext = () => {
    if (!audioRef.current) return;

    const audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audioRef.current);
    const analyzer = audioContext.createAnalyser();

    analyzer.fftSize = 2048;
    analyzer.smoothingTimeConstant = 0.2;

    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzerRef.current = analyzer;

    const runBeatDetection = () => {
      requestAnimationFrame(runBeatDetection);
    };

    runBeatDetection();
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      if (!analyzerRef.current) {
        setupAudioContext();
      }

      if (isPlaying) {
        audioRef.current.pause();
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      } else {
        await audioRef.current.play();
        updateAudioData();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateAudioData = () => {
    if (!analyzerRef.current) return;

    const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
    analyzerRef.current.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    const finalValue = average;

    setAudioData(finalValue);
    animationFrameRef.current = requestAnimationFrame(updateAudioData);
  };

  // Update timer function
  const updateTimer = () => {
    const now = new Date();
    setCurrentTime(now);

    const days = differenceInDays(targetDate, now);
    const hours = differenceInHours(targetDate, now) % 24;
    const minutes = differenceInMinutes(targetDate, now) % 60;
    const seconds = differenceInSeconds(targetDate, now) % 60;

    const daysSince = differenceInDays(now, trailerDate);

    setTimeLeft({ days, hours, minutes, seconds });
    setDaysSinceTrailer(daysSince);
  };

  // Initialize timer
  useEffect(() => {
    // Initial update
    updateTimer();

    // Set up interval
    timerRef.current = setInterval(updateTimer, 1000);

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Empty dependency array since we're using refs

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Calculate dynamic styles based on audio data
  const pulseScale = 1 + (audioData / 255) * 0.5;
  const glowIntensity = Math.floor((audioData / 255) * 30);

  // Add particle effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.speedX,
            y: particle.y + particle.speedY,
            opacity: particle.opacity - 0.02,
          }))
          .filter((particle) => particle.opacity > 0);

        if (Math.random() < 0.3) {
          newParticles.push({
            x: Math.random() * window.innerWidth,
            y: window.innerHeight,
            size: Math.random() * 3 + 2,
            opacity: 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: -Math.random() * 2 - 1,
          });
        }

        return newParticles;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const shareContent = () => {
    const shareData = {
      title: "GTA VI Countdown Timer",
      text: `Only ${timeLeft.days} days, ${timeLeft.hours} hours until GTA VI! Check out the countdown timer!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    }
  };

  // Add new functions for settings
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };


  return (
    <main className="relative min-h-screen overflow-hidden">


      <CursorEffect audioData={audioData} />
      <audio ref={audioRef} loop className="hidden">
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      {/* Particle Effect with density control */}
      {isPlaying && (
        <div className="absolute inset-0 z-0">
          {particles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                left: particle.x,
                top: particle.y,
                background: `rgba(255, 46, 137, ${particle.opacity})`,
                boxShadow: `0 0 ${particle.size * 2}px rgba(255, 46, 137, ${
                  particle.opacity * 0.5
                })`,
              }}
            />
          ))}
        </div>
      )}

      {/* Enhanced Background Image */}
      <Image
        src="/gta-vi-bg.jpg"
        alt="GTA VI Background"
        fill
        className="object-cover object-center transition-all duration-100"
        style={{
          filter: `blur(${
            (audioData / 255) * 8
          }px) brightness(${
            0.7 + (audioData / 255) * 1.2
          }) contrast(${1 + (audioData / 255) * 0.3 })`,
        }}
        priority
      />

      {/* Enhanced Gradient Overlay */}
      <div
        className="absolute inset-0 transition-all duration-100"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(0, 0, 0, ${
              0.7 - (audioData / 255) * 0.4
            }) 0%,
            rgba(0, 0, 0, ${
              0.5 - (audioData / 255) * 0.3
            }) 50%,
            rgba(0, 0, 0, ${
              0.8 - (audioData / 255) * 0.4
            }) 100%
          )`,
        }}
      />

      {/* Audio Visualizer with intensity control */}
      <AudioVisualizer
        audioData={audioData }
        isPlaying={isPlaying}
      />

      {/* Enhanced Music Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="p-3 glass-effect rounded-full text-white hover:text-[#ff2e89] transition-colors"
          style={{
            boxShadow: `0 0 ${
              10 + (audioData / 255) * 20
            }px rgba(255, 46, 137, ${0.3 + (audioData / 255) * 0.5})`,
          }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareContent}
          className="p-3 glass-effect rounded-full text-white hover:text-[#ff2e89] transition-colors"
          style={{
            boxShadow: `0 0 ${
              10 + (audioData / 255) * 20
            }px rgba(255, 46, 137, ${0.3 + (audioData / 255) * 0.5})`,
          }}
        >
          <Share2 size={24} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(!showInfo)}
          className="p-3 glass-effect rounded-full text-white hover:text-[#ff2e89] transition-colors"
          style={{
            boxShadow: `0 0 ${
              10 + (audioData / 255) * 20
            }px rgba(255, 46, 137, ${0.3 + (audioData / 255) * 0.5})`,
          }}
        >
          <Info size={24} />
        </motion.button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 right-4 z-20 glass-effect p-6 rounded-lg w-80"
          style={{
            boxShadow: `0 0 ${
              10 + (audioData / 255) * 20
            }px rgba(255, 46, 137, ${0.3 + (audioData / 255) * 0.5})`,
          }}
        >
          <h2 className="text-xl font-bold text-white mb-4 font-orbitron">
            About GTA VI
          </h2>
          <p className="text-white/80 mb-4">
            Grand Theft Auto VI is the upcoming installment in the GTA series,
            set to release on May 26, 2026.
          </p>
          <p className="text-white/80">
            This countdown timer was created to celebrate the anticipation of
            the game&apos;s release.
          </p>
        </motion.div>
      )}

      {/* Settings Panel */}
      <SettingsPanel
        audioData={audioData}
        onVolumeChange={handleVolumeChange}
      />

      {/* Enhanced Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl w-full"
        >
          <motion.img
            src="/logo.png"
            alt="GTA VI Logo"
            className="mx-auto font-bold mb-8 neon-text font-press-start w-44"
            animate={{
              scale: pulseScale,
              rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />

          <p className="text-sm md:text-base mb-12 font-orbitron">
            26 May 2026 <span className="neon-text-blue">(Confirmed)</span>
          </p>

          {/* Improved Timer Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <motion.div
                key={unit}
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: `0 0 ${glowIntensity}px rgba(220, 20, 60, 0.5)`,
                }}
                transition={{ duration: 0.1 }}
                className="timer-box p-6 rounded-lg"
              >
                <div className="text-4xl md:text-5xl font-bold font-orbitron text-[#ff2e89]">
                  {value.toString().padStart(2, "0")}
                </div>
                <div className="text-sm uppercase mt-2 font-press-start">
                  {unit}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Days since trailer with reactive glow */}
          <div className="flex items-center  flex-col md:flex-row gap-6 justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                boxShadow: `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.2)`,
              }}
              transition={{ delay: 0.5, duration: 0.1 }}
              className="glass-effect p-8 rounded-lg max-w-md "
            >
              <h2 className="text-xl mb-4 font-orbitron">
                Days Since First Trailer
              </h2>
              <div className="text-4xl font-bold text-[#ffb366] font-press-start">
                {daysSinceTrailer}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                boxShadow: `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.2)`,
              }}
              transition={{ delay: 0.7, duration: 0.1 }}
              className="glass-effect p-8 rounded-lg max-w-lg  "
            >
              <h2 className="text-xl mb-4 font-orbitron">Current Time</h2>
              <div className="text-4xl font-bold text-[#ff2e89] font-press-start">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </motion.div>
          </div>
          <motion.a
            href="https://www.youtube.com/watch?v=QdBZY2fkU-0"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              boxShadow: `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.2)`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.9, duration: 0.1 }}
            className="glass-effect p-6 rounded-lg max-w-md mx-auto mt-8 flex items-center justify-center gap-3 text-[#ff2e89] hover:text-[#ffb366] transition-colors font-orbitron"
          >
            <Youtube size={24} />
            Watch Trailer
          </motion.a>
        </motion.div>
      </div>

      {/* Enhanced Credits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-4 left-0 right-0 text-center z-20"
      >
        <a
          href="https://waseemanjum.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/70 hover:text-[#ff2e89] transition-colors font-orbitron"
          style={{
            textShadow: `0 0 ${
              5 + (audioData / 255) * 10
            }px rgba(255, 46, 137, ${0.3 + (audioData / 255) * 0.5})`,
          }}
        >
          Created by Waseem Anjum
        </a>
      </motion.div>
    </main>
  );
}
