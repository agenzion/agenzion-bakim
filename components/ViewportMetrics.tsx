'use client';

import { useEffect } from 'react';

const ViewportMetrics = () => {
  useEffect(() => {
    const root = document.documentElement;
    let frameId: number | null = null;

    const updateViewportMetrics = () => {
      const viewport = window.visualViewport;
      const viewportHeight = Math.round(viewport?.height ?? window.innerHeight);

      root.style.setProperty('--app-viewport-height', `${viewportHeight}px`);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateViewportMetrics();
      });
    };

    updateViewportMetrics();
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('orientationchange', scheduleUpdate);
    window.visualViewport?.addEventListener('resize', scheduleUpdate);
    window.visualViewport?.addEventListener('scroll', scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('orientationchange', scheduleUpdate);
      window.visualViewport?.removeEventListener('resize', scheduleUpdate);
      window.visualViewport?.removeEventListener('scroll', scheduleUpdate);
    };
  }, []);

  return null;
};

export default ViewportMetrics;
