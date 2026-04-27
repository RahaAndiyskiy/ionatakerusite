'use client';

export default function Works() {
  return (
    <section id="works" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#111111] to-[#181818]">
      <canvas
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
