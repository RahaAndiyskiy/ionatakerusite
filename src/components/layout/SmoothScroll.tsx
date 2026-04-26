'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose for Hero snap logic
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value?: number) {
        return arguments.length
          ? lenis.scrollTo(value as number, { immediate: true })
          : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleRefresh);
    window.addEventListener('load', handleRefresh);

    return () => {
      window.removeEventListener('resize', handleRefresh);
      window.removeEventListener('load', handleRefresh);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <main className="flex-1">{children}</main>;
}

/*
  Настройки Lenis:
  - duration          : отвечает за плавность и «мягкость» остановки/старта.
  - easing            : кривая движения, определяет инерцию.
  - wheelMultiplier   : множитель скорости колесика мыши.
  - touchMultiplier   : множитель жестов на сенсорных экранах.
  - syncTouch         : включает сглаживание для тач-устройств.
  - infinite          : зацикливание прокрутки, если нужно «бесконечный» эффект.
  - gestureOrientation: направление управления жестами (vertical/horizontal/both).
  - orientation       : направление основного скролла.

  Если нужно более «жидкий» ход, увеличьте duration.
  Если хотите менее заметную инерцию — уменьшите duration или поменяйте easing.
*/
