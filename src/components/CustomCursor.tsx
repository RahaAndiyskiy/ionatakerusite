'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const rafRef = useRef<number | null>(null);
  const worksActiveRef = useRef(false);

  
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursorColor = (isActive: boolean) => {
      if (worksActiveRef.current) {
        cursor.style.backgroundColor = isActive
          ? 'rgba(255, 243, 230, 0.35)'
          : 'rgba(255, 243, 230, 0.9)';
      } else {
        cursor.style.backgroundColor = isActive
          ? 'rgba(107, 30, 35, 0.2)'
          : 'rgba(107, 30, 35, 0.8)';
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      targetX.current = event.clientX;
      targetY.current = event.clientY;
      const invertTarget = (event.target as HTMLElement)?.closest('button, a, [data-cursor="invert"]');
      const isActive = Boolean(invertTarget);
      cursor.classList.toggle('cursor--active', isActive);
      updateCursorColor(isActive);
    };

    const updateWorksState = (isActive: boolean) => {
      worksActiveRef.current = isActive;
      const isCursorActive = cursor.classList.contains('cursor--active');
      updateCursorColor(isCursorActive);
    };

    const observeWorksSection = () => {
      const worksSection = document.getElementById('works');
      if (!worksSection) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          updateWorksState(entry.isIntersecting && entry.intersectionRatio > 0.35);
        },
        {
          root: null,
          rootMargin: '0px 0px -60% 0px',
          threshold: [0.35],
        }
      );

      observer.observe(worksSection);
      return observer;
    };

    const observer = observeWorksSection();
    updateCursorColor(false);

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
      if (observer) observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
