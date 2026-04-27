'use client';

import { useEffect, useRef } from 'react';
import { useWorksActive } from '@/context/WorkSectionContext';

export default function CustomCursor() {
  const worksActive = useWorksActive();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafRef = useRef<number | null>(null);

  const worksActiveRef = useRef(worksActive);

  const getCursorColor = (isActive: boolean, activeSection: boolean) => {
    if (activeSection) {
      return isActive ? 'rgba(255, 243, 230, 0.35)' : 'rgba(255, 243, 230, 0.9)';
    }
    return isActive ? 'rgba(107, 30, 35, 0.2)' : 'rgba(107, 30, 35, 0.8)';
  };

  useEffect(() => {
    worksActiveRef.current = worksActive;
  }, [worksActive]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursorColor = (isActive: boolean) => {
      cursor.style.backgroundColor = getCursorColor(isActive, worksActiveRef.current);
    };

    const onMouseMove = (event: MouseEvent) => {
      targetX.current = event.clientX;
      targetY.current = event.clientY;
      const invertTarget = (event.target as HTMLElement)?.closest('button, a, [data-cursor="invert"]');
      const isActive = Boolean(invertTarget);
      cursor.classList.toggle('cursor--active', isActive);
      updateCursorColor(isActive);
    };

    const initialColor = () => updateCursorColor(false);

    const animate = () => {
      currentX.current += (targetX.current - currentX.current) * 0.05;
      currentY.current += (targetY.current - currentY.current) * 0.05;
      cursor.style.left = `${currentX.current}px`;
      cursor.style.top = `${currentY.current}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    initialColor();
    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const isActive = cursor.classList.contains('cursor--active');
    cursor.style.backgroundColor = getCursorColor(isActive, worksActive);
  }, [worksActive]);

  return <div ref={cursorRef} className="custom-cursor" />;
}
