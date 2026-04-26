"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroTextBlurEffect() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".card-inner", {
        filter: "blur(10px)",
      });

      gsap.set(".word-reveal", {
        opacity: 0,
        y: 12,
        filter: "blur(8px)",
        display: "inline-block",
      });

      gsap.set(".hero-title, .hero-kicker, .hero-copy, .scene, .hero-word-cloud, .audio-switch", {
        opacity: 1,
        filter: "blur(0px)",
      });

      gsap.set(".scroll-end-content", {
        xPercent: 40,
        opacity: 0,
        filter: "blur(12px)",
      });

      gsap.set(".scroll-action-button", {
        opacity: 0,
        y: 16,
        scale: 0.98,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-shell",
          start: "top top",
          end: "+=510%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      timeline
        .addLabel("cards-reveal", 2.4)
        .to(
          ".card-left .card-inner",
          {
            filter: "blur(0px)",
            duration: 1.08,
            ease: "power2.out",
          },
          "cards-reveal",
        )
        .to(
          ".card-left .word-reveal",
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            stagger: { each: 0.16, from: "start" },
            duration: 0.672,
          },
          "cards-reveal+=0.1",
        )
        .addLabel("right-text", "cards-reveal+=1.6")
        .to(
          ".card-right .card-inner",
          {
            filter: "blur(0px)",
            duration: 1.08,
            ease: "power2.out",
          },
          "right-text",
        )
        .to(
          ".card-right .word-reveal",
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            stagger: { each: 0.16, from: "start" },
            duration: 1.05,
          },
          "right-text+=0.1",
        )
        .addLabel("flyby-start", "right-text+=2.55")
        .to(
          ".hero-kicker",
          {
            opacity: 0,
            y: -16,
            duration: 1.2,
            ease: "power2.out",
          },
          "flyby-start+=0.18",
        )
        .to(
          ".hero-title",
          {
            opacity: 0,
            y: -32,
            scale: 0.92,
            duration: 1.2,
            ease: "power2.out",
          },
          "flyby-start+=0.18",
        )
        .to(
          ".hero-copy, .scene, .hero-word-cloud, .audio-switch",
          {
            opacity: 0,
            duration: 1.6,
            ease: "power1.out",
          },
          "flyby-start+=0.4",
        )
        .to(
          ".scroll-end-content",
          {
            xPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power1.out",
          },
          "flyby-start+=0.4",
        )
        .to(
          ".scroll-action-button",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
          },
          "flyby-start+=1.0",
        );
    });

    return () => ctx.revert();
  }, []);

  return null;
}
