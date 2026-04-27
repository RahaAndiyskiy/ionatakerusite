'use client';

import { useEffect, useRef } from 'react';

export default function SectionHashSync() {
  const activeHashRef = useRef<string>('');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (sections.length === 0) return;

    const updateHash = (sectionId: string | null) => {
      const targetLocation = sectionId ? `#${sectionId}` : `${window.location.pathname}${window.location.search}`;
      if (activeHashRef.current === targetLocation) return;
      activeHashRef.current = targetLocation;
      window.history.replaceState(null, '', targetLocation);

      if (sectionId === 'works') {
        document.body.classList.add('works-active');
      } else {
        document.body.classList.remove('works-active');
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;

        for (const entry of entries) {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }

        if (!bestEntry) return;

        const sectionId = bestEntry.target.id;
        if (sectionId === 'hero') {
          updateHash(null);
        } else {
          updateHash(sectionId);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.4, 0.6, 0.8],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
