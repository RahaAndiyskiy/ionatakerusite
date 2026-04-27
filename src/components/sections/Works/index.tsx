'use client';

import { useEffect, useRef, useState } from 'react';
import { Space_Mono } from 'next/font/google';
import GlitchText from '@/components/ui/GlitchText';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useSetWorksActive } from '@/context/WorkSectionContext';

const shareTechMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export default function Works() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const setWorksActive = useSetWorksActive();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const works = [
    { id: '01', title: 'OBISIDIAN', type: 'WEB DESIGN', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80' },
    { id: '02', title: 'SOLEIL', type: 'BRAND SYSTEM', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80' },
    { id: '03', title: 'AETHER', type: 'INTERFACE', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
    { id: '04', title: 'VORTEX', type: 'DIGITAL CAMPAIGN', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' },
  ];

  const sectionCopyGroups = [
    ['A focused selection', 'of digital work.'],
    ['Built with intent.', 'Driven by precision.'],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 0.5 + Math.random() * 1.5,
      speed: 0.15 + Math.random() * 0.45,
      alpha: 0.08 + Math.random() * 0.25,
      drift: Math.random() * Math.PI * 2,
    }));

    const progressRef = { current: 0 };
    let beamOffset = 0;
    let beamDirection = 0.35;
    let currentBeamAlpha = 0.05;
    let currentBeamWidth = 0.55;
    let currentBeamHeight = 0.75;
    let currentParticleCount = 40;
    let currentParticleAlphaFactor = 1;
    let currentParticleSpeedFactor = 1;

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawFrame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const rawProgress = progressRef.current;
      const phase = clamp(rawProgress / 0.7, 0, 1);
      const targetBeamAlpha = lerp(0.05, 0.18, phase);
      const targetBeamWidth = lerp(0.55, 0.85, phase);
      const targetBeamHeight = lerp(0.75, 1.1, phase);
      const targetParticleCount = lerp(40, 120, phase);
      const targetParticleAlphaFactor = lerp(1, 1.8, phase);
      const targetParticleSpeedFactor = lerp(1, 1.2, phase);

      currentBeamAlpha = lerp(currentBeamAlpha, targetBeamAlpha, 0.08);
      currentBeamWidth = lerp(currentBeamWidth, targetBeamWidth, 0.08);
      currentBeamHeight = lerp(currentBeamHeight, targetBeamHeight, 0.08);
      currentParticleCount = lerp(currentParticleCount, targetParticleCount, 0.06);
      currentParticleAlphaFactor = lerp(currentParticleAlphaFactor, targetParticleAlphaFactor, 0.05);
      currentParticleSpeedFactor = lerp(currentParticleSpeedFactor, targetParticleSpeedFactor, 0.05);

      const activeCount = Math.round(currentParticleCount);

      for (let i = 0; i < activeCount; i += 1) {
        const particle = particles[i];
        particle.y += particle.speed * currentParticleSpeedFactor;
        particle.drift += 0.002;
        particle.x += Math.sin(particle.drift) * 0.2;

        if (particle.y - particle.size > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }

        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;

        context.beginPath();
        const alpha = clamp(particle.alpha * currentParticleAlphaFactor, 0, 0.45);
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      beamOffset += beamDirection;
      if (beamOffset > canvas.width * 0.5 || beamOffset < -canvas.width * 0.3) {
        beamDirection *= -1;
      }
      const baseX = beamOffset;
      const offsetX = baseX + rawProgress * canvas.width * 0.3;
      const offsetY = -canvas.height * 0.15;
      const gradient = context.createLinearGradient(
        offsetX,
        offsetY,
        offsetX + canvas.width * currentBeamWidth,
        offsetY + canvas.height * currentBeamHeight
      );

      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.22, `rgba(255, 255, 255, ${currentBeamAlpha * 0.35})`);
      gradient.addColorStop(0.38, `rgba(255, 255, 255, ${currentBeamAlpha * 0.72})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${currentBeamAlpha})`);
      gradient.addColorStop(0.62, `rgba(255, 255, 255, ${currentBeamAlpha * 0.72})`);
      gradient.addColorStop(0.78, `rgba(255, 255, 255, ${currentBeamAlpha * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // chromatic aberration edges: delicate color on both sides
      context.globalCompositeOperation = 'lighter';

      const edgeShift = 10;
      const edgeWidth = canvas.width * 0.25;
      const leftGradient = context.createLinearGradient(
        offsetX - edgeShift,
        offsetY,
        offsetX - edgeShift + edgeWidth,
        offsetY + canvas.height * currentBeamHeight
      );
      leftGradient.addColorStop(0, 'rgba(221, 160, 221, 0)');
      leftGradient.addColorStop(0.3, 'rgba(221, 160, 221, 0.05)');
      leftGradient.addColorStop(0.45, 'rgba(221, 160, 221, 0.08)');
      leftGradient.addColorStop(0.55, 'rgba(221, 160, 221, 0.05)');
      leftGradient.addColorStop(1, 'rgba(221, 160, 221, 0)');
      context.fillStyle = leftGradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const rightGradient = context.createLinearGradient(
        offsetX + edgeShift,
        offsetY,
        offsetX + edgeShift + edgeWidth,
        offsetY + canvas.height * currentBeamHeight
      );
      rightGradient.addColorStop(0, 'rgba(135, 206, 255, 0)');
      rightGradient.addColorStop(0.3, 'rgba(135, 206, 255, 0.05)');
      rightGradient.addColorStop(0.45, 'rgba(135, 206, 255, 0.08)');
      rightGradient.addColorStop(0.55, 'rgba(135, 206, 255, 0.05)');
      rightGradient.addColorStop(1, 'rgba(135, 206, 255, 0)');
      context.fillStyle = rightGradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.globalCompositeOperation = 'source-over';

      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    };

    let worksIsActive = false;
    const updateWorksActive = (active: boolean) => {
      if (worksIsActive === active) return;
      worksIsActive = active;
      setWorksActive(active);
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        updateWorksActive(entry.isIntersecting && entry.intersectionRatio > 0.4);
      },
      {
        root: null,
        rootMargin: '0px 0px -30% 0px',
        threshold: [0.05, 0.15, 0.4],
      }
    );
    visibilityObserver.observe(section);

    const cardElements = rowRefs.current[0]?.querySelectorAll('article');
    if (cardElements && cardElements.length) {
      gsap.set(cardElements, { autoAlpha: 0.05, filter: 'blur(8px)' });
      gsap.to(cardElements, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        ease: 'none',
        stagger: {
          each: 0.18,
          amount: 0.4,
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    const copyWords = section.querySelectorAll('.works-copy .word');
    if (copyWords.length) {
      gsap.set(copyWords, { color: 'rgba(255, 243, 230, 0.05)' });
      gsap.to(copyWords, {
        color: 'rgba(255, 243, 230, 1)',
        ease: 'none',
        stagger: {
          each: 0.06,
          amount: 0.4,
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    setSize();
    drawFrame();

    const handleResize = () => {
      setSize();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      visibilityObserver.disconnect();
      scrollTrigger.kill();
      setWorksActive(false);
    };
  }, [setWorksActive]);

  rowRefs.current = [];

  return (
    <section ref={sectionRef} id="works" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#111111] to-[#181818]">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 py-24 md:px-16 md:py-32">
        <div className="relative">
          <div className="max-w-screen-xl">
            <h2 className="max-w-xl text-[clamp(2.5rem,6vw,5.5rem)] font-light uppercase tracking-[-0.04em] leading-tight text-[#FFF3E6]">
              SELECTED<br />WORK
            </h2>
          </div>

          <div className="mt-16 max-w-md text-base leading-9 text-[#FFF3E6]/20 lg:absolute lg:right-18 lg:top-0 lg:text-left works-copy">
            <div className="space-y-7">
              {sectionCopyGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-1">
                  {group.map((line, lineIndex) => (
                    <p key={lineIndex} className="flex flex-wrap justify-start gap-x-2 gap-y-2 text-[1.1rem] leading-[1.45]">
                      {line.split(' ').map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className="word inline-block font-medium"
                          style={{ color: 'rgba(255, 243, 230, 0.05)' }}
                        >
                          {word}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-30">
          <div
            ref={(el) => { rowRefs.current[0] = el; }}
            className="grid gap-5 grid-cols-1 md:grid-cols-4"
          >
            {works.map((project, index) => (
              <article
                key={project.id}
                data-cursor="invert"
                className="group relative overflow-hidden bg-transparent transition-transform duration-300 ease-out will-change-transform hover:scale-[1.01]"
              >
                <div
                  className="relative h-[320px] overflow-hidden"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover filter grayscale transition-all duration-500 ease-out group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/10" />
                </div>

                <div className={`mt-4 text-[0.72rem] uppercase tracking-[0.3em] leading-[1.2] text-white/75 ${shareTechMono.className}`}>
                  <span className="text-[#f4f4e6] font-semibold">&gt; {project.id}</span>
                  <GlitchText
                    text={project.title}
                    className="mx-3 text-white/90"
                    duration={35}
                    iterations={6}
                    keepPlayingOnLeave={false}
                    hovered={hoveredCard === index}
                  />
                  <span className="text-[#b0b0a0]">// {project.type}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
