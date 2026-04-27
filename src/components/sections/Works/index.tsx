'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export default function Works() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    let currentBeamAlpha = 0.05;
    let currentBeamWidth = 0.65;
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
      const targetBeamWidth = lerp(0.65, 0.95, phase);
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

      beamOffset += 0.5;
      const baseX = (beamOffset % (canvas.width * 1.25)) - canvas.width * 0.2;
      const offsetX = baseX + rawProgress * canvas.width * 0.3;
      const offsetY = -canvas.height * 0.15;
      const gradient = context.createLinearGradient(
        offsetX,
        offsetY,
        offsetX + canvas.width * currentBeamWidth,
        offsetY + canvas.height * currentBeamHeight
      );

      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.18, `rgba(255, 255, 255, ${currentBeamAlpha * 0.5})`);
      gradient.addColorStop(0.32, `rgba(255, 255, 255, ${currentBeamAlpha * 0.9})`);
      gradient.addColorStop(0.45, `rgba(255, 255, 255, ${currentBeamAlpha})`);
      gradient.addColorStop(0.55, `rgba(255, 255, 255, ${currentBeamAlpha * 0.9})`);
      gradient.addColorStop(0.68, `rgba(255, 255, 255, ${currentBeamAlpha * 0.45})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

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
      scrollTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="works" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#111111] to-[#181818]">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 py-24 md:px-16 md:py-32">
        <div className="max-w-screen-xl">
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-light uppercase tracking-[-0.04em] text-[#FFF3E6]">
            SELECTED WORK
          </h2>
        </div>
      </div>
    </section>
  );
}
