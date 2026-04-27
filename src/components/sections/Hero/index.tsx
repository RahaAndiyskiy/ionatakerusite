'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import useHoverTone from '@/hooks/useHoverTone';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const titleMaskRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const newTitleContainerRef = useRef<HTMLDivElement>(null);

  const playHoverTone = useHoverTone('/sounds/hover 1.wav');
  const playClickTone = useHoverTone('/sounds/Click 1.wav');

  const breathingTlRef = useRef<gsap.core.Timeline | null>(null);

  // 🎯 БАЗОВАЯ КАМЕРА (главное)
  const BASE_X = 0;   // двигаешь тут композицию
  const BASE_Y = 60;

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

  // 🫀 лёгкое "дыхание"
  useEffect(() => {
    if (!bgRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'power1.inOut' },
    });

    tl.to(bgRef.current, {
      scale: 1.015,
      duration: 4,
    });

    breathingTlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!bgRef.current || !sectionRef.current) return;

    const BASE_X = 0;
    const BASE_Y = 60;
    const SCROLL_RANGE = 100;
    const SCROLL_THRESHOLD = 0.08; // порог начала scroll-driven состояния
    const MASK_START   = 0.08; // первый начинает уходить за левое плечо
    const MASK_END     = 0.50; // первый полностью за фигурой — медленнее
    const REVEAL_START = 0.52; // пауза, потом второй из правого плеча
    const REVEAL_END   = 0.72; // второй полностью вышел

    let frame: number | null = null;

    const target = { textX: 0, textY: 0, bgX: 0, bgY: 0 };
    const current = { textX: 0, textY: 0, bgX: 0, bgY: 0 };

    let targetScrollX = 0;
    let currentScrollX = 0;
    let scrollProgress = 0;
    let isScrolling = false;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const update = () => {
      current.textX = lerp(current.textX, target.textX, 0.08);
      current.textY = lerp(current.textY, target.textY, 0.08);
      current.bgX   = lerp(current.bgX,   target.bgX,   0.08);
      current.bgY   = lerp(current.bgY,   target.bgY,   0.08);

      // TEXT
      if (textWrapRef.current) {
        textWrapRef.current.style.transform =
          `translate3d(${current.textX}px, ${current.textY}px, 0)`;
      }

      // BG (scroll + mouse вместе)
      currentScrollX = lerp(currentScrollX, targetScrollX, 0.12);
      if (bgRef.current) {
        bgRef.current.style.backgroundPosition =
          `calc(${BASE_X + currentScrollX}% + ${current.bgX}px) calc(${BASE_Y}% + ${current.bgY}px)`;
      }

      if (titleMaskRef.current || newTitleContainerRef.current) {
        const maskProgress   = Math.min(1, Math.max(0, (scrollProgress - MASK_START)   / (MASK_END   - MASK_START)));
        const revealProgress = Math.min(1, Math.max(0, (scrollProgress - REVEAL_START) / (REVEAL_END - REVEAL_START)));

        if (titleMaskRef.current) {
          titleMaskRef.current.style.clipPath =
            `inset(0 ${maskProgress * 100}% 0 0)`;
          titleMaskRef.current.style.webkitMaskImage =
            `linear-gradient(to left, transparent 0%, transparent calc(${maskProgress * 100}% - 24px), black calc(${maskProgress * 100}% + 2px), black 100%)`;
          titleMaskRef.current.style.maskImage =
            `linear-gradient(to left, transparent 0%, transparent calc(${maskProgress * 100}% - 24px), black calc(${maskProgress * 100}% + 2px), black 100%)`;
          titleMaskRef.current.style.maskMode = 'alpha';
          titleMaskRef.current.style.filter = `blur(${maskProgress < 0.9 ? maskProgress * 1.5 : 0}px)`;
        }

        if (newTitleContainerRef.current) {
          newTitleContainerRef.current.style.clipPath =
            `inset(0 0 0 ${(1 - revealProgress) * 100}%)`;
          newTitleContainerRef.current.style.webkitMaskImage =
            `linear-gradient(to right, transparent 0%, transparent calc(${(1 - revealProgress) * 100}% - 24px), black calc(${(1 - revealProgress) * 100}% + 2px), black 100%)`;
          newTitleContainerRef.current.style.maskImage =
            `linear-gradient(to right, transparent 0%, transparent calc(${(1 - revealProgress) * 100}% - 24px), black calc(${(1 - revealProgress) * 100}% + 2px), black 100%)`;
          newTitleContainerRef.current.style.maskMode = 'alpha';
          newTitleContainerRef.current.style.filter = `blur(${(1 - revealProgress) * 4}px)`;
        }
      }

      const moving =
        Math.abs(current.textX - target.textX) > 0.05 ||
        Math.abs(current.textY - target.textY) > 0.05 ||
        Math.abs(current.bgX - target.bgX) > 0.05 ||
        Math.abs(current.bgY - target.bgY) > 0.05 ||
        Math.abs(currentScrollX - targetScrollX) > 0.05;

      if (moving || isScrolling) {
        frame = requestAnimationFrame(update);
      } else {
        frame = null;
      }
    };

    const handleMove = (e: PointerEvent) => {
      if (!sectionRef.current || isScrolling) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      const clamp = (v: number) => Math.max(-1, Math.min(1, v));

      target.textX = clamp(x) * 2;
      target.textY = clamp(y) * 2;
      target.bgX   = -clamp(x) * 10;
      target.bgY   = -clamp(y) * 6;

      if (!frame) frame = requestAnimationFrame(update);
    };

    const reset = () => {
      target.textX = 0;
      target.textY = 0;
      target.bgX = 0;
      target.bgY = 0;

      if (!frame) frame = requestAnimationFrame(update);
    };

    sectionRef.current.addEventListener('pointermove', handleMove);
    sectionRef.current.addEventListener('pointerleave', reset);

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=100%',
      scrub: true,
      pin: true,

      onEnter: () => {
        reset();
      },
      onEnterBack: () => {
        reset();
      },
      onLeave: () => {
        isScrolling = false;
      },
      onLeaveBack: () => {
        isScrolling = false;
      },

      onUpdate: (self) => {
        scrollProgress = self.progress;
        targetScrollX = self.progress * SCROLL_RANGE;
        isScrolling = self.progress > SCROLL_THRESHOLD && self.progress < 1;

        if (!frame) frame = requestAnimationFrame(update);
      },
    });

    return () => {
      st.kill();
      sectionRef.current?.removeEventListener('pointermove', handleMove);
      sectionRef.current?.removeEventListener('pointerleave', reset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // ✨ текст анимация
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from(headlineRef.current, { y: 40, opacity: 0, duration: 1 })
      .from(sublineRef.current, { y: 20, opacity: 0, duration: 0.8 }, '-=0.5')
      .from(ctaRef.current, { y: 16, opacity: 0, duration: 0.6 }, '-=0.4');
  }, []);

  // инициализация второго заголовка — спрятан через clipPath
  useEffect(() => {
    if (!newTitleContainerRef.current) return;
    newTitleContainerRef.current.style.clipPath = 'inset(0 0 0 100%)';
    newTitleContainerRef.current.style.filter = 'blur(4px)';
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-end px-6 md:px-16 pb-24 md:pb-40 overflow-hidden"
    >
      {/* 🎬 BG */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/bg`s/Full.jpg")',
          backgroundSize: '150%',
          backgroundPosition: `${BASE_X}% ${BASE_Y}%`,
          transformOrigin: 'center center',
        }}
      />

      {/* 📝 TEXT */}
      <div ref={textWrapRef} className="relative z-10 w-full">
        <div
          ref={titleMaskRef}
          className="overflow-hidden"
          style={{
            clipPath: 'inset(0 0 0 0)',
            willChange: 'clip-path, filter',
            WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 0%, black 100%)',
            maskImage: 'linear-gradient(to left, transparent 0%, black 0%, black 100%)',
            maskMode: 'alpha',
          }}
        >
          <h1
            ref={headlineRef}
            className="font-kiona tracking-tight leading-[0.85] text-black mb-8 w-fit"
          >
            <span className="block text-[clamp(1.8rem,5.2vw,4.8rem)] font-light uppercase opacity-60">
              i create
            </span>

            <span className="block text-[clamp(4rem,13vw,14rem)] font-black leading-none uppercase">
              TRENDS<span style={{ color: '#6B1E23' }}>.</span>
            </span>

            <span className="block text-[clamp(1rem,2.4vw,2.2rem)] font-light uppercase opacity-50 mt-2">
              not follow them.
            </span>
          </h1>

          <p
            ref={sublineRef}
            className="text-lg text-black/70 max-w-md mb-12"
          >
            Art direction & visual design
          </p>

          <div className="flex flex-col gap-4">
            <Link
              href="/#work"
              className="group h-10 flex items-center overflow-hidden text-xs font-kiona tracking-[0.2em] uppercase border border-black/70 hover:border-black transition-colors px-6 relative w-fit"
              style={{ color: '#6B1E23' }}
              onMouseEnter={playHoverTone}
              onMouseLeave={playHoverTone}
              onPointerDown={playClickTone}
            >
              <span className="transition-transform duration-[400ms] ease-in-out group-hover:translate-x-[1.8em]">
                WORS
              </span>
              <span className="ml-2 transition-transform duration-[400ms] ease-in-out group-hover:translate-x-[400%]" aria-hidden="true">
                →
              </span>
              <span className="absolute left-6 transition-transform duration-[400ms] ease-in-out -translate-x-[400%] group-hover:translate-x-0" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={newTitleContainerRef}
        className="absolute bottom-24 md:bottom-40 right-6 md:right-16 z-20 max-w-[65vw]"
      >
        <div className="overflow-hidden">
          <h1
            className="font-kiona tracking-tight leading-[0.85] text-black mb-8 ml-auto w-fit grid grid-cols-[auto_auto] items-baseline"
          >
            {/* верхняя строка — на всю ширину IT HITS. */}
            <span className="col-span-2 block text-[clamp(1rem,2.4vw,2.2rem)] font-light uppercase opacity-50 mb-2 text-right w-full">
              it doesn&apos;t just look expensive.
            </span>

            {/* IT — левая колонка */}
            <span className="text-[clamp(4rem,13vw,14rem)] font-black leading-none uppercase pr-[0.22em]">
              <span style={{ color: '#6B1E23' }}>.</span>IT
            </span>

            {/* HITS + different. — правая колонка */}
            <span className="flex flex-col items-stretch">
              <span className="text-[clamp(4rem,13vw,14rem)] font-black leading-none uppercase text-right">
                HITS
              </span>
              <span
                className="block text-[clamp(1.8rem,5.2vw,4.8rem)] font-light uppercase opacity-60 mt-1 text-right"
              >
                 .different
              </span>
            </span>
          </h1>

          <p
            className="text-lg text-black/70 max-w-md mb-12 ml-auto text-right"
          >
            Art direction & visual design
          </p>

          <div className="ml-auto w-fit">
            <Link
              href="/#about"
              className="group h-10 flex items-center overflow-hidden text-xs font-kiona tracking-[0.2em] uppercase border border-black/70 hover:border-black transition-colors px-10 relative"
              style={{ color: '#6B1E23' }}
              onMouseEnter={playHoverTone}
              onMouseLeave={playHoverTone}
              onPointerDown={playClickTone}
            >
              <span className="absolute left-8 transition-transform duration-[400ms] ease-in-out translate-x-0 group-hover:-translate-x-[400%]" aria-hidden="true">
                ←
              </span>
              <span className="ml-4 transition-transform duration-[400ms] ease-in-out group-hover:-translate-x-[1.8em]">
                ABOUT ME
              </span>
              <span className="absolute right-8 transition-transform duration-[400ms] ease-in-out translate-x-[400%] group-hover:translate-x-0" aria-hidden="true">
                ←
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}