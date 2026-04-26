'use client';

import { useRef, useCallback, useEffect, useState, type ElementType } from 'react';

const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}~±§';
const FAST_GLITCH_CHARS = '№%?';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  duration?: number;
  iterations?: number;
  chars?: string;
  swapText?: string;
  keepPlayingOnLeave?: boolean;
  autoPlayInterval?: number;
  onGlitchEnd?: () => void;
  playOnChange?: boolean;
}

export default function GlitchText({
  text,
  className = '',
  as: Tag = 'span',
  duration = 25,
  iterations = 5,
  chars = GLITCH_CHARS,
  swapText,
  keepPlayingOnLeave = false,
  autoPlayInterval,
  onGlitchEnd,
  playOnChange = false,
}: GlitchTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const activeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHovered = useRef(false);
  const isAnimatingRef = useRef(false);
  const autoPlayTimer = useRef<number | null>(null);
  const [isSwapped, setIsSwapped] = useState(false);

  const randomChar = (fast = false) => {
    const pool = fast ? FAST_GLITCH_CHARS : chars;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const clearAll = useCallback(() => {
    activeTimers.current.forEach(clearTimeout);
    activeTimers.current = [];
  }, []);

  const restoreAll = useCallback(() => {
    if (!containerRef.current) return;
    const spans = Array.from(
      containerRef.current.querySelectorAll<HTMLSpanElement>('[data-char]')
    );
    spans.forEach(s => {
      s.textContent = s.getAttribute('data-char') ?? '';
    });
  }, []);

  const startGlitch = useCallback((fast = false) => {
    if (!containerRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    clearAll();

    const spans = Array.from(
      containerRef.current.querySelectorAll<HTMLSpanElement>('[data-char]')
    );
    let originalChars = spans.map(s => s.getAttribute('data-char') ?? '');
    const targetChars = isSwapped ? text.split('') : swapText?.split('') ?? originalChars;
    const shouldSwap = swapText != null && targetChars.length === spans.length;
    const runThroughLeave = keepPlayingOnLeave;
    const fastMode = fast && playOnChange;
    const currentIterations = fastMode ? Math.min(iterations, 3) : iterations;
    const currentDuration = fastMode ? Math.max(20, Math.min(duration, 40)) : duration;

    const indices = [...Array(spans.length).keys()].sort(() => Math.random() - 0.5);
    let maxRestoreAt = 0;

    indices.forEach((charIdx, orderIdx) => {
      const isSpaceChar = originalChars[charIdx] === ' ';
      const finalChar = shouldSwap ? targetChars[charIdx] : originalChars[charIdx];
      for (let frame = 0; frame < currentIterations; frame++) {
        const t = setTimeout(() => {
          if (!runThroughLeave && !isHovered.current && !fastMode) return;
          if (isSpaceChar) return;
          spans[charIdx].textContent = randomChar(fastMode);
        }, orderIdx * currentDuration * 1.5 + frame * currentDuration);
        activeTimers.current.push(t);
      }
      const restoreAt = orderIdx * currentDuration * 1.5 + currentIterations * currentDuration;
      if (restoreAt > maxRestoreAt) maxRestoreAt = restoreAt;
      const rt = setTimeout(() => {
        if (!runThroughLeave && !isHovered.current && !fastMode) return;
        spans[charIdx].textContent = finalChar;
        spans[charIdx].setAttribute('data-char', finalChar);
      }, restoreAt);
      activeTimers.current.push(rt);
    });

    const endTimer = setTimeout(() => {
      if (!runThroughLeave && !isHovered.current && !fastMode) {
        isAnimatingRef.current = false;
        return;
      }
      if (shouldSwap) {
        setIsSwapped(prev => !prev);
      }
      onGlitchEnd?.();
      isAnimatingRef.current = false;
    }, maxRestoreAt + 30);
    activeTimers.current.push(endTimer);
  }, [clearAll, duration, iterations, isSwapped, keepPlayingOnLeave, onGlitchEnd, playOnChange, swapText, text]);

  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
    startGlitch(false);
  }, [startGlitch]);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    if (!keepPlayingOnLeave) {
      clearAll();
      restoreAll();
      isAnimatingRef.current = false;
    }
  }, [clearAll, keepPlayingOnLeave, restoreAll]);

  useEffect(() => {
    if (!autoPlayInterval || typeof window === 'undefined') return;

    autoPlayTimer.current = window.setInterval(() => {
      startGlitch(false);
    }, autoPlayInterval);

    return () => {
      if (autoPlayTimer.current !== null) {
        window.clearInterval(autoPlayTimer.current);
      }
    };
  }, [autoPlayInterval, startGlitch]);

  useEffect(() => {
    setIsSwapped(false);
  }, [text, swapText]);

  useEffect(() => {
    if (!playOnChange) return;
    startGlitch(true);
  }, [playOnChange, startGlitch, text]);

  useEffect(() => {
    return () => {
      clearAll();
      if (autoPlayTimer.current !== null) {
        window.clearInterval(autoPlayTimer.current);
      }
    };
  }, [clearAll]);

  const currentText = isSwapped ? swapText ?? text : text;

  return (
    <Tag
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {currentText.split('').map((char, i) => (
        <span key={i} data-char={char}>
          {char}
        </span>
      ))}
      <span className="sr-only">{currentText}</span>
    </Tag>
  );
}
