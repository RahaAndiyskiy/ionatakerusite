'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (event: MouseEvent) => {
      targetX.current = event.clientX;
      targetY.current = event.clientY;
      const invertTarget = (event.target as HTMLElement)?.closest('button, a, [data-cursor="invert"]');
      if (invertTarget) {
        cursor.classList.add('cursor--active');
      } else {
        cursor.classList.remove('cursor--active');
      }
    };

    const animate = () => {
      currentX.current += (targetX.current - currentX.current) * 0.05;
      currentY.current += (targetY.current - currentY.current) * 0.05;
      cursor.style.left = `${currentX.current}px`;
      cursor.style.top = `${currentY.current}px`;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
