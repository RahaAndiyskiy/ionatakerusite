'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import GlitchText from '@/components/ui/GlitchText';
import useHoverTone from '@/hooks/useHoverTone';
import { useSound } from '@/context/SoundContext';

// ─── константы ───────────────────────────────────────────────
const BRAND = '#6B1E23';

const NAV_LINKS = [
  { href: '#works', label: 'Works' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

// ─── компонент ───────────────────────────────────────────────
export default function Header() {
  const menuOpenRef = useRef(false);
  const tlRef       = useRef<gsap.core.Timeline | null>(null);
  const [worksActive, setWorksActive] = useState(false);
  const { muted, toggleMuted } = useSound();

  const playHoverTone = useHoverTone('/sounds/hover 1.wav');
  const playClickTone = useHoverTone('/sounds/Click 1.wav');
  const playMenuHoverTone = useHoverTone('/sounds/hoverMenuButtons.wav');

  const headerColor = worksActive ? '#FFF3E6' : BRAND;

  // DOM refs
  const lineRef    = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);
  const itemsRef   = useRef<(HTMLAnchorElement | null)[]>([]);
  const burgerRef  = useRef<HTMLButtonElement>(null);
  const bar1Ref    = useRef<HTMLSpanElement>(null);
  const bar2Ref    = useRef<HTMLSpanElement>(null);

  // ─── инициализация ───────────────────────────────────────
  useEffect(() => {
    if (!navWrapRef.current) return;
    gsap.set(navWrapRef.current, { height: 0 });
    gsap.set(itemsRef.current.filter(Boolean), { opacity: 0, y: -8 });
  }, []);

  // ─── переключение цвета хедера для секции Works ─────────────────
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let frameId: number | null = null;

    const observeWorksSection = () => {
      const worksSection = document.getElementById('works');
      if (!worksSection) {
        frameId = window.requestAnimationFrame(observeWorksSection);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setWorksActive(entry.isIntersecting && entry.intersectionRatio > 0.35);
        },
        {
          root: null,
          rootMargin: '0px 0px -60% 0px',
          threshold: [0.35],
        }
      );

      observer.observe(worksSection);
    };

    observeWorksSection();

    return () => {
      if (observer) observer.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  // ─── hover бургера ───────────────────────────────────────
  useEffect(() => {
    const btn = burgerRef.current;
    if (!btn) return;

    const onEnter = () => {
      if (menuOpenRef.current) return;
      gsap.to(bar1Ref.current, { x: 3,  duration: 0.35, ease: 'power2.out' });
      gsap.to(bar2Ref.current, { x: -3, duration: 0.35, ease: 'power2.out' });
    };
    const onLeave = () => {
      if (menuOpenRef.current) return;
      gsap.to(bar1Ref.current, { x: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(bar2Ref.current, { x: 0, duration: 0.35, ease: 'power2.out' });
    };

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ─── toggle меню ─────────────────────────────────────────
  const toggleMenu = () => {
    const isOpen = !menuOpenRef.current;
    menuOpenRef.current = isOpen;

    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    const items = itemsRef.current.filter(Boolean);

    if (isOpen) {
      if (!navWrapRef.current) return;
      // измеряем высоту меню
      gsap.set(navWrapRef.current, { height: 'auto' });
      const navHeight = navWrapRef.current.getBoundingClientRect().height;
      gsap.set(navWrapRef.current, { height: 0 });

      tl.to(bar1Ref.current, { y: 3.5, rotate: 45,  duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(bar2Ref.current, { y: -3.5, rotate: -45, duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(navWrapRef.current, { height: navHeight, duration: 0.45, ease: 'power3.out' }, 0.1)
        .to(lineRef.current,   { y: navHeight,       duration: 0.45, ease: 'power2.out' }, 0.1)
        .to(items,             { opacity: 1, y: 0,   duration: 0.4,  ease: 'power2.out' }, 0.3);
    } else {
      tl.to(lineRef.current,    { y: 0,           duration: 0.4,  ease: 'power2.in'   }, 0)
        .to(items,              { opacity: 0, y: -8, duration: 0.25, ease: 'power2.in' }, 0)
        .to(navWrapRef.current, { height: 0,       duration: 0.4,  ease: 'power3.in'  }, 0.15)
        .to(bar1Ref.current,    { y: 0, rotate: 0, duration: 0.3,  ease: 'power2.inOut' }, 0.25)
        .to(bar2Ref.current,    { y: 0, rotate: 0, duration: 0.3,  ease: 'power2.inOut' }, 0.25);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (sectionId: string) => {
    toggleMenu();
    scrollToSection(sectionId);
  };

  // ─── JSX ─────────────────────────────────────────────────
  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ '--header-color': headerColor } as React.CSSProperties}>

      {/* ── топ-бар ── */}
      <div className="px-6 md:px-16 py-6 flex items-center justify-between relative">

        {/* декоративная линия */}
        <div
          ref={lineRef}
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-1/3 h-px pointer-events-none"
          style={{ backgroundColor: 'var(--header-color)', opacity: 0.5 }}
        />

        {/* лого */}
        <Link
          href="/"
          className="text-lg font-kiona tracking-[0.25em] uppercase relative z-10"
          style={{ color: 'var(--header-color)' }}
        >
          <GlitchText
            text="IONA | TAKERU"
            swapText="CODE & DESIGN"
            chars="イオナタケル武勇刃炎龍剣風雷影光"
            duration={35}
            iterations={4}
            keepPlayingOnLeave
            autoPlayInterval={12000}
          />
        </Link>

        {/* правый блок */}
        <div className="flex items-center gap-4 relative z-10">

          {/* кнопка звука */}
          <button
            type="button"
            onClick={toggleMuted}
            onPointerDown={playClickTone}
            onMouseEnter={playHoverTone}
            onMouseLeave={playHoverTone}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            className="group flex items-center justify-center w-10 h-10 border transition-colors flex-shrink-0"
            style={{ color: 'var(--header-color)', borderColor: 'var(--header-color)' }}
          >
            <span className="transition-transform duration-200 ease-in-out transform group-hover:scale-105 text-[0.55rem] font-kiona tracking-[0.22em] uppercase leading-none">
              {muted ? 'MUTE' : 'SND'}
            </span>
          </button>

          {/* CTA кнопка */}
          <Link
            href="/#contact"
            className="group h-10 flex items-center overflow-hidden text-xs font-kiona tracking-[0.2em] uppercase border transition-colors px-6 relative"
            style={{ color: 'var(--header-color)', borderColor: 'var(--header-color)' }}
            onMouseEnter={playHoverTone}
            onMouseLeave={playHoverTone}
            onPointerDown={playClickTone}
          >
            <span className="transition-transform duration-[400ms] ease-in-out group-hover:translate-x-[1.8em]">
              LET&apos;S TALK
            </span>
            <span className="ml-2 transition-transform duration-[400ms] ease-in-out group-hover:translate-x-[400%]" aria-hidden="true">→</span>
            <span className="absolute left-6 transition-transform duration-[400ms] ease-in-out -translate-x-[400%] group-hover:translate-x-0" aria-hidden="true">→</span>
          </Link>

          {/* бургер */}
          <button
            ref={burgerRef}
            onClick={toggleMenu}
            onPointerDown={playClickTone}
            aria-label="Toggle menu"
            className="group flex flex-col justify-center items-center gap-[6px] w-10 h-10 border transition-colors flex-shrink-0"
            style={{ borderColor: 'var(--header-color)' }}
            onMouseEnter={playHoverTone}
            onMouseLeave={playHoverTone}
          >
            <span ref={bar1Ref} className="block w-5 h-px" style={{ backgroundColor: 'var(--header-color)' }} />
            <span ref={bar2Ref} className="block w-5 h-px" style={{ backgroundColor: 'var(--header-color)' }} />
          </button>
        </div>
      </div>

      {/* ── меню ── */}
      <div ref={navWrapRef} className="overflow-hidden" style={{ height: 0 }}>
        <nav className="px-6 md:px-16 pb-4 pt-1 flex flex-row items-center justify-center gap-12">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              ref={el => { itemsRef.current[i] = el; }}
              onClick={(event) => {
                event.preventDefault();
                handleNavClick(link.href.replace(/^#/, ''));
              }}
              className="text-sm font-kiona tracking-[0.2em] uppercase transition-colors"
              style={{ color: 'var(--header-color)' }}
              onMouseEnter={playMenuHoverTone}
            >
              <GlitchText text={link.label} />
            </a>
          ))}
        </nav>
      </div>

    </header>
  );
}
