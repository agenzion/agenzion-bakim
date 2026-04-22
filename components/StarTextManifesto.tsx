"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
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

type SectionTargets = {
  fontSize: number;
  points: Point[];
};

type ChangeSectionOptions = {
  force?: boolean;
};

const TRANSITION_LOCK_MS = 2000;
const WHEEL_DELTA_THRESHOLD = 36;
const TOUCH_DELTA_THRESHOLD = 50;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const TITLE_LETTER_SPACING_PX = 4;
const TITLE_BREAK_TAG_PATTERN = /<br\s*\/?>/gi;
const TITLE_TAG_PATTERN = /<[^>]+>/g;
const TITLE_POINT_CONFIG = {
  mobile: {
    gap: 2,
    maxPoints: 2600,
    alphaThreshold: 104,
  },
  tablet: {
    gap: 3,
    maxPoints: 5600,
    alphaThreshold: 116,
  },
  desktop: {
    gap: 3,
    maxPoints: 9000,
    alphaThreshold: 120,
  },
} as const;
const DESCRIPTION_TRANSITION = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const;

const getContentFrame = (width: number, height: number) => {
  if (width < MOBILE_BREAKPOINT) {
    const topInset = 118;
    const bottomInset = 156;

    return {
      topInset,
      bottomInset,
      centerY: topInset + (height - topInset - bottomInset) / 2,
    };
  }

  if (width < TABLET_BREAKPOINT) {
    const topInset = 142;
    const bottomInset = 176;

    return {
      topInset,
      bottomInset,
      centerY: topInset + (height - topInset - bottomInset) / 2,
    };
  }

  const topInset = 164;
  const bottomInset = 188;

  return {
    topInset,
    bottomInset,
    centerY: topInset + (height - topInset - bottomInset) / 2,
  };
};

const getTitlePointConfig = (width: number) => {
  if (width < MOBILE_BREAKPOINT) {
    return TITLE_POINT_CONFIG.mobile;
  }

  if (width < TABLET_BREAKPOINT) {
    return TITLE_POINT_CONFIG.tablet;
  }

  return TITLE_POINT_CONFIG.desktop;
};

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

const decodeTitleEntities = (text: string) => {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
};

const getPlainTitle = (title: string) => {
  return decodeTitleEntities(
    title
      .replace(TITLE_BREAK_TAG_PATTERN, " ")
      .replace(TITLE_TAG_PATTERN, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
};

const getExplicitTitleLines = (title: string) => {
  return title
    .replace(TITLE_BREAK_TAG_PATTERN, "\n")
    .split(/\n+/)
    .map((line) =>
      decodeTitleEntities(line.replace(TITLE_TAG_PATTERN, ""))
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
};

const getTitleLines = (title: string, width: number) => {
  const plainTitle = getPlainTitle(title);

  if (!plainTitle) {
    return [];
  }

  if (width < MOBILE_BREAKPOINT) {
    const hasManualBreaks = /<br\s*\/?>/i.test(title) || title.includes("\n");
    const explicitLines = getExplicitTitleLines(title);

    if (hasManualBreaks && explicitLines.length > 0) {
      return explicitLines;
    }

    return plainTitle.split(/\s+/).filter(Boolean);
  }

  return [plainTitle];
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
    const isCompactViewport = width < MOBILE_BREAKPOINT;
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
    this.size = isCompactViewport
      ? Math.random() * 1.15 + 0.75
      : Math.random() * 1.15 + 0.7;
    this.baseOpacity = isCompactViewport
      ? Math.random() * 0.26 + 0.62
      : Math.random() * 0.3 + 0.56;
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

const getBaseFontSize = (text: string, width: number, lineCount = 1) => {
  if (text === "agenzion") {
    if (width < MOBILE_BREAKPOINT) return 48;
    if (width < TABLET_BREAKPOINT) return 80;
    return 120;
  }

  if (width < MOBILE_BREAKPOINT) return lineCount > 1 ? 44 : 34;
  if (width < TABLET_BREAKPOINT) return 56;
  return 80;
};

const getTitleLetterSpacing = (width: number) => {
  if (width < MOBILE_BREAKPOINT) return 1.5;
  if (width < TABLET_BREAKPOINT) return 3;
  return TITLE_LETTER_SPACING_PX;
};

const getTitleMaxWidth = (width: number) => {
  if (width < MOBILE_BREAKPOINT) {
    return Math.max(248, width - 48);
  }

  if (width < TABLET_BREAKPOINT) {
    return width * 0.78;
  }

  return width * 0.84;
};

const getTitleLineHeight = (fontSize: number, width: number) => {
  return fontSize * (width < MOBILE_BREAKPOINT ? 1.08 : 1);
};

const getTitleBlockHeight = (
  fontSize: number,
  lineCount: number,
  width: number,
) => {
  if (lineCount <= 0) {
    return 0;
  }

  return fontSize + (lineCount - 1) * getTitleLineHeight(fontSize, width);
};

const getTitleMaxHeight = (
  hasDescription: boolean,
  width: number,
  height: number,
) => {
  const { topInset, bottomInset } = getContentFrame(width, height);
  const availableHeight = Math.max(0, height - topInset - bottomInset);

  if (width < MOBILE_BREAKPOINT) {
    const cap = hasDescription ? 232 : 320;
    const ratio = hasDescription ? 0.52 : 0.72;

    return Math.max(96, Math.min(cap, availableHeight * ratio));
  }

  if (width < TABLET_BREAKPOINT) {
    return Math.max(120, availableHeight * 0.42);
  }

  return Math.max(140, availableHeight * 0.36);
};

const getMeasuredTitleWidth = (
  ctx: CanvasRenderingContext2D,
  lines: string[],
  letterSpacing: number,
) => {
  return Math.max(
    0,
    ...lines.map(
      (line) =>
        ctx.measureText(line).width +
        Math.max(0, Array.from(line).length - 1) * letterSpacing,
    ),
  );
};

const fitFontSize = (
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  hasDescription: boolean,
) => {
  const lines = getTitleLines(text, width);
  let fontSize = getBaseFontSize(getPlainTitle(text), width, lines.length);
  const minFontSize = width < MOBILE_BREAKPOINT ? 16 : 20;
  const maxWidth = getTitleMaxWidth(width);
  const maxHeight = getTitleMaxHeight(hasDescription, width, height);
  const letterSpacing = getTitleLetterSpacing(width);

  while (fontSize > minFontSize) {
    ctx.font = `800 ${fontSize}px Outfit, system-ui, sans-serif`;

    if (
      getMeasuredTitleWidth(ctx, lines, letterSpacing) <= maxWidth &&
      getTitleBlockHeight(fontSize, lines.length, width) <= maxHeight
    ) {
      return fontSize;
    }

    fontSize -= 2;
  }

  return fontSize;
};

const applyTitleTypography = (
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  width: number,
) => {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${fontSize}px Outfit, system-ui, sans-serif`;

  const letterSpacingContext = ctx as CanvasRenderingContext2D & {
    letterSpacing?: string;
  };
  letterSpacingContext.letterSpacing = `${getTitleLetterSpacing(width)}px`;
};

const drawTitleLines = (
  ctx: CanvasRenderingContext2D,
  lines: string[],
  centerX: number,
  centerY: number,
  fontSize: number,
  width: number,
) => {
  if (lines.length === 0) {
    return;
  }

  const lineHeight = getTitleLineHeight(fontSize, width);
  const firstLineY = centerY - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, firstLineY + index * lineHeight);
  });
};

const getTitleOffsetY = (hasDescription: boolean, width: number) => {
  if (!hasDescription) {
    return 0;
  }

  if (width < MOBILE_BREAKPOINT) {
    return -62;
  }

  if (width < TABLET_BREAKPOINT) {
    return -82;
  }

  return -96;
};

const getTitleCenterY = (
  hasDescription: boolean,
  width: number,
  height: number,
) => {
  const { centerY } = getContentFrame(width, height);
  return centerY + getTitleOffsetY(hasDescription, width);
};

export default function StarTextManifesto({
  sections,
  indicatorLabel,
  footerCopy,
  allowPageScrollAtEdges = false,
  scrollDriven = false,
  showIndicators = true,
}: {
  sections: readonly ManifestoSection[];
  indicatorLabel: string;
  footerCopy: {
    copyrightName: string;
  };
  allowPageScrollAtEdges?: boolean;
  scrollDriven?: boolean;
  showIndicators?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [titleFontSizes, setTitleFontSizes] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleOverlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const activeSectionRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const targetsRef = useRef<Point[][]>([]);
  const transitionParticlesRef = useRef<((index: number) => void) | null>(null);
  const wheelDeltaAccumulatorRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const touchStartY = useRef(0);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

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

  const scrollToSectionIndex = (
    newIndex: number,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || sections.length <= 1) return;

    const scrollableDistance = Math.max(0, wrapper.offsetHeight - window.innerHeight);
    const targetProgress = newIndex / (sections.length - 1);
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.round(wrapperTop + scrollableDistance * targetProgress),
      behavior,
    });
  };

  const changeSection = (newIndex: number, options: ChangeSectionOptions = {}) => {
    if (!options.force && isTransitioningRef.current) return;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const previousIndex = activeSectionRef.current;
    if (newIndex === previousIndex) return;

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

  const goToSection = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= sections.length) return;

    if (scrollDriven) {
      scrollToSectionIndex(newIndex);
    }

    changeSection(newIndex, { force: true });
  };

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const previousProgress = scrollProgressRef.current;
    scrollProgressRef.current = value;

    if (!scrollDriven || sections.length <= 1) {
      return;
    }

    if (isTransitioningRef.current) {
      return;
    }

    const currentIndex = activeSectionRef.current;
    const lastIndex = sections.length - 1;
    const enteredFromBefore =
      currentIndex === 0 && previousProgress <= 0.01 && value > 0.01;
    const enteredFromAfter =
      currentIndex === lastIndex && previousProgress >= 0.99 && value < 0.99;

    if (enteredFromBefore || enteredFromAfter) {
      wheelDeltaAccumulatorRef.current = 0;
      scrollToSectionIndex(enteredFromBefore ? 0 : lastIndex);
      lockTransitions(650);
      return;
    }

    const nextIndex = Math.max(
      0,
      Math.min(
        sections.length - 1,
        Math.round(value * (sections.length - 1)),
      ),
    );

    if (nextIndex === currentIndex) {
      return;
    }

    const direction = nextIndex > currentIndex ? 1 : -1;
    const targetIndex = Math.max(
      0,
      Math.min(lastIndex, currentIndex + direction),
    );

    changeSection(targetIndex);
    scrollToSectionIndex(targetIndex);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    const extractTargets = (
      section: ManifestoSection,
      width: number,
      height: number,
    ): SectionTargets => {
      const { title, text } = section;
      const titleLines = getTitleLines(title, width);

      if (titleLines.length === 0) {
        return {
          fontSize: getBaseFontSize(title, width),
          points: [],
        };
      }

      const offCanvas = document.createElement("canvas");
      offCanvas.width = width;
      offCanvas.height = height;

      const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
      if (!offCtx) {
        return {
          fontSize: getBaseFontSize(title, width),
          points: [],
        };
      }

      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = "white";

      const fontSize = fitFontSize(offCtx, title, width, height, Boolean(text));
      applyTitleTypography(offCtx, fontSize, width);
      drawTitleLines(
        offCtx,
        titleLines,
        width / 2,
        getTitleCenterY(Boolean(text), width, height),
        fontSize,
        width,
      );

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      const points: Point[] = [];
      const isCompactViewport = width < MOBILE_BREAKPOINT;
      const { alphaThreshold, gap, maxPoints } = getTitlePointConfig(width);

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData[(y * width + x) * 4 + 3];

          if (alpha > alphaThreshold) {
            points.push({ x, y });

            const gridIndex = x / gap + y / gap;

            if (alpha > 210 && gridIndex % 2 === 0) {
              points.push({
                x: Math.min(width, x + gap * 0.45),
                y: Math.min(height, y + gap * 0.2),
              });
            }

            if (!isCompactViewport && alpha > 230 && gridIndex % 3 === 0) {
              points.push({
                x: Math.max(0, x - gap * 0.35),
                y: Math.max(0, y + gap * 0.4),
              });
            }
          }
        }
      }

      const shuffledPoints = shuffle(points);

      return {
        fontSize,
        points:
          shuffledPoints.length > maxPoints
            ? shuffledPoints.slice(0, maxPoints)
            : shuffledPoints,
      };
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
      const isCompactViewport = width < MOBILE_BREAKPOINT;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        isCompactViewport ? 1.35 : 2,
      );

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const sectionTargets = sections.map((section) => extractTargets(section, width, height));

      targetsRef.current = sectionTargets.map((target) => target.points);
      setTitleFontSizes(sectionTargets.map((target) => target.fontSize));
      setViewport((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      );

      const maxTargets = Math.max(
        ...sectionTargets.map((target) => target.points.length),
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

    // Pause the particle loop when the canvas is not visible.
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

  useEffect(() => {
    const canvas = titleOverlayCanvasRef.current;
    if (!canvas || viewport.width < 1 || viewport.height < 1) {
      return;
    }

    const width = viewport.width;
    const height = viewport.height;

    if (width >= MOBILE_BREAKPOINT) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;

    const draw = () => {
      if (cancelled) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const section = sections[activeSection];
      if (!section) {
        return;
      }
      const titleLines = getTitleLines(section.title, width);
      const fontSize =
        titleFontSizes[activeSection] ??
        fitFontSize(ctx, section.title, width, height, Boolean(section.text));

      applyTitleTypography(ctx, fontSize, width);
      ctx.fillStyle = "rgba(255,255,255,0.16)";

      const centerX = width / 2;
      const centerY = getTitleCenterY(Boolean(section.text), width, height);

      drawTitleLines(ctx, titleLines, centerX, centerY, fontSize, width);
    };

    if ("fonts" in document) {
      void document.fonts.ready.then(draw);
    } else {
      draw();
    }

    return () => {
      cancelled = true;
    };
  }, [activeSection, sections, titleFontSizes, viewport.height, viewport.width]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (scrollDriven) {
      if (isTransitioningRef.current) {
        wheelDeltaAccumulatorRef.current = 0;
        event.preventDefault();
        return;
      }

      const currentIndex = activeSectionRef.current;
      const isLeavingBeforeFirst = currentIndex === 0 && event.deltaY < 0;
      const isLeavingAfterLast =
        currentIndex === sections.length - 1 && event.deltaY > 0;

      if (allowPageScrollAtEdges && (isLeavingBeforeFirst || isLeavingAfterLast)) {
        wheelDeltaAccumulatorRef.current = 0;
        return;
      }

      event.preventDefault();
      wheelDeltaAccumulatorRef.current += event.deltaY;

      if (Math.abs(wheelDeltaAccumulatorRef.current) < WHEEL_DELTA_THRESHOLD) {
        return;
      }

      const direction = wheelDeltaAccumulatorRef.current > 0 ? 1 : -1;
      wheelDeltaAccumulatorRef.current = 0;
      const targetIndex = currentIndex + direction;

      if (targetIndex < 0 || targetIndex >= sections.length) {
        return;
      }

      changeSection(targetIndex);
      scrollToSectionIndex(targetIndex);
      return;
    }

    if (event.deltaY > 50) {
      if (activeSectionRef.current === sections.length - 1) {
        if (allowPageScrollAtEdges) {
          return;
        }
        event.preventDefault();
        return;
      }

      event.preventDefault();
      changeSection(activeSectionRef.current + 1);
    } else if (event.deltaY < -50) {
      if (activeSectionRef.current === 0) {
        if (allowPageScrollAtEdges) {
          return;
        }
        event.preventDefault();
        return;
      }

      event.preventDefault();
      changeSection(activeSectionRef.current - 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartY.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (scrollDriven) {
      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      const currentY = event.touches[0]?.clientY ?? touchStartY.current;
      const deltaY = touchStartY.current - currentY;
      const currentIndex = activeSectionRef.current;
      const isLeavingBeforeFirst = currentIndex === 0 && deltaY < 0;
      const isLeavingAfterLast =
        currentIndex === sections.length - 1 && deltaY > 0;

      if (allowPageScrollAtEdges && (isLeavingBeforeFirst || isLeavingAfterLast)) {
        return;
      }

      event.preventDefault();
      return;
    }

    if (allowPageScrollAtEdges) {
      return;
    }
    event.preventDefault();
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (scrollDriven) {
      if (isTransitioningRef.current) {
        event.preventDefault();
        return;
      }

      const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) < TOUCH_DELTA_THRESHOLD) {
        return;
      }

      const currentIndex = activeSectionRef.current;
      const direction = deltaY > 0 ? 1 : -1;
      const targetIndex = currentIndex + direction;
      const isLeavingBeforeFirst = currentIndex === 0 && direction < 0;
      const isLeavingAfterLast =
        currentIndex === sections.length - 1 && direction > 0;

      if (allowPageScrollAtEdges && (isLeavingBeforeFirst || isLeavingAfterLast)) {
        return;
      }

      event.preventDefault();

      if (targetIndex < 0 || targetIndex >= sections.length) {
        return;
      }

      changeSection(targetIndex);
      scrollToSectionIndex(targetIndex);
      return;
    }

    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current;
    const deltaY = touchStartY.current - touchEndY;

    if (deltaY > 50) {
      if (activeSectionRef.current === sections.length - 1) {
        if (allowPageScrollAtEdges) {
          return;
        }
        event.preventDefault();
        return;
      }

      event.preventDefault();
      changeSection(activeSectionRef.current + 1);
    } else if (deltaY < -50) {
      if (activeSectionRef.current === 0) {
        if (allowPageScrollAtEdges) {
          return;
        }
        event.preventDefault();
        return;
      }

      event.preventDefault();
      changeSection(activeSectionRef.current - 1);
    }
  };

  const activeSectionData = sections[activeSection];
  const activeText = activeSectionData.text;
  const isFooterVisible = Boolean(activeSectionData.showsFooter);
  const viewportWidth = viewport.width || MOBILE_BREAKPOINT;
  const isCompactViewport = viewportWidth < MOBILE_BREAKPOINT;

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${scrollDriven ? "overflow-visible" : "overflow-hidden"} overscroll-none`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: scrollDriven || allowPageScrollAtEdges ? "pan-y" : "none" }}
    >
      <div
        className={scrollDriven ? "relative w-full" : "relative h-[100dvh] w-full"}
        style={scrollDriven ? { height: `${Math.max(2, sections.length) * 100}dvh` } : undefined}
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-[2] bg-transparent"
            style={{ width: "100vw", height: "100dvh" }}
          />

          <AnimatePresence>
            {isCompactViewport ? (
              <motion.canvas
                key={`mobile-title-overlay-${activeSection}`}
                ref={titleOverlayCanvasRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 z-[1] bg-transparent md:hidden"
                aria-hidden="true"
              />
            ) : null}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 pt-[7.4rem] pb-[9.75rem] md:px-10 md:pt-[9rem] md:pb-[11rem] lg:px-12 lg:pt-[10rem] lg:pb-[12rem]">
            <AnimatePresence mode="wait">
              {activeText ? (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={DESCRIPTION_TRANSITION}
                  className="mt-[6.75rem] w-full max-w-[22rem] text-center md:mt-[8.5rem] md:max-w-2xl lg:mt-[9rem] lg:max-w-3xl"
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

          {showIndicators ? (
            <div className="absolute right-6 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4 md:right-12">
              {sections.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSection(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    index === activeSection
                      ? "scale-150 bg-white"
                      : "bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`${indicatorLabel} ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
