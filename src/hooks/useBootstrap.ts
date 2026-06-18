'use client';

import { useEffect } from 'react';
import { useExperience } from '@/store/experienceStore';

/** Detects mobile + reduced-motion once on mount. */
export function useBootstrap() {
  const setReducedMotion = useExperience((s) => s.setReducedMotion);
  const setIsMobile = useExperience((s) => s.setIsMobile);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const apply = () => {
      setReducedMotion(mqMotion.matches);
      setIsMobile(mqMobile.matches);
    };
    apply();
    mqMotion.addEventListener('change', apply);
    mqMobile.addEventListener('change', apply);
    return () => {
      mqMotion.removeEventListener('change', apply);
      mqMobile.removeEventListener('change', apply);
    };
  }, [setReducedMotion, setIsMobile]);
}
