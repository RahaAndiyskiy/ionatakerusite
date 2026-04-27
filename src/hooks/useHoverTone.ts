'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';

const DEFAULT_AUDIO_SRC = '/hover 1.wav';
const BASE_RATE = 1.0;
const RATE_VARIANCE = 0.05;
const VOLUME = 1;

export default function useHoverTone(audioSrc: string = DEFAULT_AUDIO_SRC) {
  const safeAudioSrc = encodeURI(audioSrc);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { muted } = useSound();

  useEffect(() => {
    audioRef.current = null;
  }, [safeAudioSrc]);

  const getBaseAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioRef.current) {
      const audio = new Audio(safeAudioSrc);
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [safeAudioSrc]);

  return useCallback(() => {
    if (muted || typeof window === 'undefined') return;

    const baseAudio = getBaseAudio();
    if (!baseAudio) return;

    const clone = baseAudio.cloneNode(true) as HTMLAudioElement;
    clone.playbackRate = BASE_RATE + (Math.random() * 2 - 1) * RATE_VARIANCE;
    clone.volume = VOLUME;

    void clone.play().catch(() => {
      // Ignore blocked autoplay on browsers until a user gesture is available.
    });
  }, [muted, getBaseAudio]);
}
