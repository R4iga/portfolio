'use client';

import { create } from 'zustand';

export type Phase = 'boot' | 'loading' | 'intro' | 'ready';

interface ExperienceState {
  // Lifecycle
  phase: Phase;
  entered: boolean;

  // Scroll / navigation
  scrollProgress: number; // 0..1 across whole page
  section: number; // 0..4 active section index
  sectionCount: number;

  // Environment
  reducedMotion: boolean;
  isMobile: boolean;

  // setters
  setPhase: (p: Phase) => void;
  setEntered: (v: boolean) => void;
  setScrollProgress: (p: number) => void;
  setReducedMotion: (v: boolean) => void;
  setIsMobile: (v: boolean) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  phase: 'boot',
  entered: false,

  scrollProgress: 0,
  section: 0,
  sectionCount: 5,

  reducedMotion: false,
  isMobile: false,

  setPhase: (phase) => set({ phase }),
  setEntered: (entered) => set({ entered }),
  setScrollProgress: (scrollProgress) =>
    set({
      scrollProgress,
      section: Math.min(4, Math.max(0, Math.round(scrollProgress * 4))),
    }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setIsMobile: (isMobile) => set({ isMobile }),
}));
