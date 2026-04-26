'use client';

import Link from 'next/link';
import { CSSProperties, ReactNode } from 'react';
import useHoverTone from '@/hooks/useHoverTone';

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function CTAButton({
  href,
  onClick,
  children,
  className = '',
  style,
}: CTAButtonProps) {
  const playHoverTone = useHoverTone('/sounds/hover 1.wav');
  const playClickTone = useHoverTone('/sounds/Click 1.wav');
  const baseClassName =
    'group h-10 flex items-center overflow-hidden text-xs font-kiona tracking-[0.2em] uppercase border border-current hover:border-current active:-translate-y-[0.5px] active:scale-[0.99] active:border-current transition-all duration-[200ms] px-6 relative';

  const classes = `${baseClassName} ${className}`.trim();
  const isHashLink = href?.includes('#');

  if (href) {
    if (isHashLink) {
      return (
        <a
          href={href}
          className={classes}
          style={style}
          onMouseEnter={playHoverTone}
          onMouseLeave={playHoverTone}
          onPointerDown={playClickTone}
          onClick={playClickTone}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        style={style}
        onMouseEnter={playHoverTone}
        onMouseLeave={playHoverTone}
        onPointerDown={playClickTone}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        playClickTone();
        onClick?.();
      }}
      className={classes}
      style={style}
      onMouseEnter={playHoverTone}
      onMouseLeave={playHoverTone}
    >
      {children}
    </button>
  );
}
