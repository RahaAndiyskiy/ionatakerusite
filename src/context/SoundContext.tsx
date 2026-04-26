"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type SoundContextValue = {
  muted: boolean;
  toggleMuted: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('sound-muted');
    if (stored !== null) {
      setMuted(stored === 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('sound-muted', muted ? 'true' : 'false');
  }, [muted]);

  const toggleMuted = () => setMuted(prev => !prev);

  return (
    <SoundContext.Provider value={{ muted, toggleMuted }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
