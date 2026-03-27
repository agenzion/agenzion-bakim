"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent, WheelEvent } from "react";
import { ABOUT_STARFLOW_EVENT, type AboutStarflowDetail } from "@/lib/aboutStarflow";
import Footer from "./Footer";

type Point = {
  x: number;
  y: number;
};

type ManifestoSection = {
  title: string;
  text: string;
  showsFooter?: boolean;
};

const TRANSITION_LOCK_MS = 2000;

const emitStarflow = (detail: AboutStarflowDetail) => {
  window.dispatchEvent(
    new CustomEvent<AboutStarflowDetail>(ABOUT_STARFLOW_EVENT, {
      detail,
    }),
  );
};

const easeInOutCubic = (progress: number) => {
  if (progress < 0.5) {
    return 4 * progress * progress * progress;
  }

  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const shuffle = <T,>(items: T[]) => {
  const clone = [...items];

  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }

  return clone;
};

const getOffscreenPoint = (
  width: number,
  height: number,
  padding = 180,
): Point => {
  const edge = Math.floor(Math.random() * 4);

  switch (edge) {
    case 0:
      return {
        x: Math.random() * width,
        y: -padding - Math.random() * padding,
      };
    case 1:
      return {
        x: width + padding + Math.random() * padding,
        y: Math.random() * height,
      };
    case 2:
      return {
        x: Math.random() * width,
        y: height + padding + Math.random() * padding,
      };
    default:
      return {
        x: -padding - Math.random() * padding,
        y: Math.random() * height,
      };
  }
};

class Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  scatterX: number;
  scatterY: number;
  targetX: number;
  targetY: number;
  delay: number;
  scatterDuration: number;
  duration: number;
  startTime: number;
  size: number;
  baseOpacity: number;
  currentOpacity: number;
  targetOpacity: number;
  isActive: boolean;

  constructor(width: number, height: number) {
    const spawnPoint = getOffscreenPoint(width, height);
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.startX = this.x;
    this.startY = this.y;
    this.scatterX = this.x;
    this.scatterY = this.y;
    this.targetX = this.x;
    this.targetY = this.y;
    this.delay = 0;
    this.scatterDuration = 500;
    this.duration = 1600;
    this.startTime = performance.now();
    this.size = Math.random() * 1.35 + 0.65;
    this.baseOpacity = Math.random() * 0.35 + 0.45;
    this.currentOpacity = 0;
    this.targetOpacity = 0;
    this.isActive = false;
  }

  setTarget(
    tx: number,
    ty: number,
    delay: number,
    scatterDuration: number,
    duration: number,
    isActive: boolean,
    scatterRadius: number,
  ) {
    this.startX = this.x;
    this.startY = this.y;
    this.scatterX = this.x + (Math.random() - 0.5) * scatterRadius;
    this.scatterY = this.y + (Math.random() - 0.5) * scatterRadius;
    this.targetX = tx;
    this.targetY = ty;
    this.delay = delay;
    this.scatterDuration = scatterDuration;
    this.duration = duration;
    this.startTime = performance.now();
    this.isActive = isActive;
    this.targetOpacity = isActive ? this.baseOpacity : 0;
  }

  update(currentTime: number) {
    this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.05;

    const elapsed = currentTime - this.startTime;
    if (elapsed < this.delay) {
      return;
    }

    const transitionTime = elapsed - this.delay;

    if (transitionTime <= this.scatterDuration) {
      const scatterProgress = Math.min(transitionTime / this.scatterDuration, 1);
      const easedScatter = easeInOutCubic(scatterProgress);

      this.x = this.startX + (this.scatterX - this.startX) * easedScatter;
      this.y = this.startY + (this.scatterY - this.startY) * easedScatter;
      return;
    }

    const convergeProgress = Math.min(
      (transitionTime - this.scatterDuration) / this.duration,
      1,
    );
    const easedConverge = easeInOutCubic(convergeProgress);

    this.x = this.scatterX + (this.targetX - this.scatterX) * easedConverge;
    this.y = this.scatterY + (this.targetY - this.scatterY) * easedConverge;
  }

  draw(ctx: CanvasRenderingContext2D, currentTime: number) {
    if (this.currentOpacity < 0.01) {
      return;
    }

    const isMoving =
      Math.abs(this.x - this.targetX) > 0.5 || Math.abs(this.y - this.targetY) > 0.5;
    let opacity = this.currentOpacity;

    if (isMoving && this.isActive) {
      opacity =
        opacity * 0.6 +
        Math.sin(currentTime / 150 + this.x * 0.1) * (opacity * 0.4);
    } else if (this.isActive) {
      opacity =
        opacity * 0.8 +
        Math.sin(currentTime / 400 + this.x * 0.05) * (opacity * 0.2);
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, opacity)})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

const getBaseFontSize = (text: string, width: number) => {
  if (text === "agenzion") {
    if (width < 768) return 48;
    if (width < 1024) return 80;
    return 120;
  }

  if (width < 768) return 32;
  if (width < 1024) return 56;
  return 80;
};

const fitFontSize = (
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
) => {
  let fontSize = getBaseFontSize(text, width);
  const maxWidth = width * 0.84;

  while (fontSize > 20) {
    ctx.font = `800 ${fontSize}px Outfit, system-ui, sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
      return fontSize;
    }

    fontSize -= 2;
  }

  return fontSize;
};

const getTitleCenterY = (
  hasDescription: boolean,
  width: number,
  height: number,
  hasFooter = false,
) => {
  if (!hasDescription) {
    return height / 2;
  }

  let centerY = height / 2 - 96;

  if (width < 768) {
    centerY = height / 2 - 62;
  } else if (width < 1024) {
    centerY = height / 2 - 82;
  }

  if (!hasFooter) {
    return centerY;
  }

  if (width < 768) return centerY - 70;
  if (width < 1024) return centerY - 84;
  return centerY - 96;
};

export default function StarTextManifesto({
  sections,
  indicatorLabel,
  footerCopy,
}: {
  sections: readonly ManifestoSection[];
  indicatorLabel: string;
  footerCopy: {
    copyrightName: string;
  };
}) {
  const [activeSection, setActiveSection] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSectionRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<Point[][]>([]);
  const transitionParticlesRef = useRef<((index: number) => void) | null>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const lockTransitions = (duration = TRANSITION_LOCK_MS) => {
    isTransitioningRef.current = true;

    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    lockTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
    }, duration);
  };

  const changeSection = (newIndex: number) => {
    if (isTransitioningRef.current) return;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const previousIndex = activeSectionRef.current;
    const direction = newIndex > previousIndex ? 1 : -1;
    const distance = Math.abs(newIndex - previousIndex);

    activeSectionRef.current = newIndex;
    setActiveSection(newIndex);
    transitionParticlesRef.current?.(newIndex);
    emitStarflow({
      direction,
      intensity: Math.min(1.5, 1 + distance * 0.18),
    });
    lockTransitions();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const extractTargets = (section: ManifestoSection, width: number, height: number) => {
      const { title, text, showsFooter } = section;

      if (!title) {
        return [];
      }

      const offCanvas = document.createElement("canvas");
      offCanvas.width = width;
      offCanvas.height = height;

      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return [];

      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = "white";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const letterSpacingContext = offCtx as CanvasRenderingContext2D & {
        letterSpacing?: string;
      };
      letterSpacingContext.letterSpacing = "4px";

      const fontSize = fitFontSize(offCtx, title, width);
      offCtx.font = `800 ${fontSize}px Outfit, system-ui, sans-serif`;
      offCtx.fillText(
        title,
        width / 2,
        getTitleCenterY(Boolean(text), width, height, Boolean(showsFooter)),
      );

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      const points: Point[] = [];
      const gap = width < 768 ? 3 : 4;

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData[(y * width + x) * 4 + 3];

          if (alpha > 128) {
            points.push({ x, y });

            if (alpha > 220 && (x / gap + y / gap) % 2 === 0) {
              points.push({
                x: Math.min(width, x + gap * 0.45),
                y: Math.min(height, y + gap * 0.2),
              });
            }

            if (alpha > 220 && (x / gap + y / gap) % 3 === 0) {
              points.push({
                x: Math.max(0, x - gap * 0.35),
                y: Math.max(0, y + gap * 0.4),
              });
            }
          }
        }
      }

      return shuffle(points);
    };

    const ensureParticleCount = (count: number, width: number, height: number) => {
      while (particlesRef.current.length < count) {
        particlesRef.current.push(new Particle(width, height));
      }
    };

    const applySectionTargets = (sectionIndex: number) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const targets = targetsRef.current[sectionIndex] || [];
      const activeParticles = particlesRef.current.slice(0, targets.length);
      const inactiveParticles = particlesRef.current.slice(targets.length);

      activeParticles.forEach((particle, index) => {
        const target = targets[index];
        const delay = (index % 180) * 3;

        particle.setTarget(target.x, target.y, delay, 320, 1080, true, 56);
      });

      inactiveParticles.forEach((particle, index) => {
        const delay = (index % 120) * 2;
        const offscreenPoint = getOffscreenPoint(viewportWidth, viewportHeight, 240);

        particle.setTarget(
          offscreenPoint.x,
          offscreenPoint.y,
          delay,
          420,
          1180,
          false,
          140,
        );
      });
    };
    const init = () => {
      if (disposed) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      targetsRef.current = sections.map((section) => extractTargets(section, width, height));

      const maxTargets = Math.max(
        ...targetsRef.current.map((targets) => targets.length),
        0,
      );

      ensureParticleCount(maxTargets, width, height);
      transitionParticlesRef.current = applySectionTargets;
      applySectionTargets(activeSectionRef.current);
    };

    const initializeWithFonts = () => {
      if ("fonts" in document) {
        void document.fonts.ready.then(init);
        return;
      }

      init();
    };

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(init, 250);
    };

    let isPaused = false;

    const draw = () => {
      if (!isPaused) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);

        const currentTime = performance.now();
        particlesRef.current.forEach((particle) => {
          particle.update(currentTime);
          particle.draw(ctx, currentTime);
        });
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };

    // On mobile the canvas can scroll out of view; pause when not intersecting.
    const observer = new IntersectionObserver(
      ([entry]) => {
        isPaused = !entry.isIntersecting || document.hidden;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    initializeWithFonts();
    draw();

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      isPaused = true;
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();

      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }

      window.cancelAnimationFrame(animationFrameId);
    };
  }, [sections]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 50) {
      if (activeSectionRef.current === sections.length - 1) {
        return;
      }

      changeSection(activeSectionRef.current + 1);
    } else if (event.deltaY < -50) {
      if (activeSectionRef.current === 0) {
        return;
      }

      changeSection(activeSectionRef.current - 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = touchStartY.current - touchEndY;

    if (deltaY > 50) {
      if (activeSectionRef.current === sections.length - 1) {
        return;
      }

      changeSection(activeSectionRef.current + 1);
    } else if (deltaY < -50) {
      if (activeSectionRef.current === 0) {
        return;
      }

      changeSection(activeSectionRef.current - 1);
    }
  };

  const activeSectionData = sections[activeSection];
  const activeText = activeSectionData.text;
  const isFooterVisible = Boolean(activeSectionData.showsFooter);
  const textBlockClass = isFooterVisible
    ? "mt-[3.25rem] w-full max-w-2xl text-center md:mt-[4.5rem] lg:mt-[5rem]"
    : "mt-[6.75rem] w-full max-w-3xl text-center md:mt-[8.5rem] lg:mt-[9rem]";

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 bg-transparent"
        style={{ width: "100vw", height: "100vh" }}
      />

      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6">
        <AnimatePresence mode="wait">
          {activeText ? (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={textBlockClass}
            >
              <p className="text-base font-light leading-relaxed tracking-wide text-gray-200 md:text-xl">
                {activeText}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFooterVisible ? (
          <motion.div
            key="manifesto-footer"
            initial={{ y: "105%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "105%", opacity: 0.6 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-28 bg-[linear-gradient(180deg,transparent_0%,rgba(2,2,6,0.64)_100%)]" />
            <div className="w-full pointer-events-auto bg-[linear-gradient(180deg,rgba(2,2,6,0.86)_0%,rgba(2,2,6,0.96)_100%)] backdrop-blur-sm">
              <Footer copy={footerCopy} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4 md:right-12">
        {sections.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => changeSection(index)}
            className={`h-2 w-2 rounded-full transition-all duration-500 ${
              index === activeSection
                ? "scale-150 bg-white"
                : "bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`${indicatorLabel} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
