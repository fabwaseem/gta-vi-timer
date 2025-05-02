"use client";

import { motion } from "framer-motion";
import { Settings, Volume2 } from "lucide-react";
import { useState } from "react";

interface SettingsPanelProps {
  audioData: number;
  onVolumeChange: (volume: number) => void;
}

export default function SettingsPanel({
  audioData,
  onVolumeChange,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(100);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    onVolumeChange(newVolume / 100);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-20 p-3 glass-effect rounded-full text-white hover:text-[#ff2e89] transition-colors"
        style={{
          boxShadow: `0 0 ${10 + (audioData / 255) * 20}px rgba(255, 46, 137, ${
            0.3 + (audioData / 255) * 0.5
          })`,
        }}
      >
        <Settings size={24} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-20 glass-effect p-6 rounded-lg w-80"
          style={{
            boxShadow: `0 0 ${
              10 + (audioData / 255) * 20
            }px rgba(255, 46, 137, ${0.3 + (audioData / 255) * 0.5})`,
          }}
        >
          <h2 className="text-xl font-bold text-white mb-4 font-orbitron">
            Settings
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={20} className="text-[#ff2e89]" />
                <span className="text-white font-orbitron">Volume</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#ff2e89]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
