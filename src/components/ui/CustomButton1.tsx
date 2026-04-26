'use client';

import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import useHoverTone from '@/hooks/useHoverTone';

interface Props {
  label?: string;
  href?: string;
  onClick?: () => void;
}

export default function CustomButton({
  label = 'VIEW WORK',
  href,
  onClick,
}: Props) {
  const Wrapper = href ? 'a' : 'button';
  const [fillCenter, setFillCenter] = useState({ x: '50%', y: '50%' });
  const [fillRadius, setFillRadius] = useState(0.08);
  const [hovered, setHovered] = useState(false);
  const gradientId = useId();
  const gradientIdRef = useRef(`buttonFill-${gradientId}`);
  const animationFrameRef = useRef<number | null>(null);
  const playHoverTone = useHoverTone('/sounds/hover 1.wav');
  const playClickTone = useHoverTone('/sounds/Click 1.wav');

  useEffect(() => {
    const animate = () => {
      setFillRadius(prev => {
        const target = hovered ? 1.5 : 0.08;
        const next = prev + (target - prev) * 0.18;
        if (Math.abs(next - target) > 0.01) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
        return next;
      });
    };

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hovered]);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFillCenter({ x: `${x}%`, y: `${y}%` });
  };

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    setHovered(true);
    handlePointerMove(event);
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <Wrapper
      href={href || '#'}
      onClick={handleClick}
      onPointerDown={playClickTone}
      onMouseEnter={playHoverTone}
      onMouseLeave={playHoverTone}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className="inline-block group"
      style={{ color: '#6B1E23' }}
    >
      <svg
        width="250"
        height="60"
        viewBox="0 0 265 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id={gradientIdRef.current}
            cx={fillCenter.x}
            cy={fillCenter.y}
            fx={fillCenter.x}
            fy={fillCenter.y}
            r={fillRadius}
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#6B1E23" stopOpacity="0.35" />
            <stop offset="20%" stopColor="#6B1E23" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#6B1E23" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6B1E23" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* OUTER BORDER WITH FILL */}
        <path
          d="M1 1 H259 V40 L235 63 H1 Z"
          fill={`url(#${gradientIdRef.current})`}
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* CONTENT */}
        <text
          x="132"
          y="38"
          fill="currentColor"
          fontSize="18"
          letterSpacing="4px"
          fontFamily="Kiona, sans-serif"
          textAnchor="middle"
          className="transition-colors duration-200 group-hover:text-white"
        >
          {label}
        </text>
      </svg>
    </Wrapper>
  );
}