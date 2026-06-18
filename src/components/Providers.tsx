'use client';

import { useEffect, type ReactNode } from 'react';
import { useExperience } from '@/store/experienceStore';
import { useAudio } from '@/store/audioStore';
import { audioEngine } from '@/audio/engine';
import { useBootstrap } from '@/hooks/useBootstrap';

/**
 * Client-side wiring: scroll tracking, audio sync, bootstrap.
 */
export function Providers({ children }: { children: ReactNode }) {
  useBootstrap();

  const enabled = useAudio((s) => s.enabled);
  const volume = useAudio((s) => s.volume);
  const setScrollProgress = useExperience((s) => s.setScrollProgress);

  // Global scroll progress -> store (drives section nav)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setScrollProgress(Math.min(1, Math.max(0, p)));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [setScrollProgress]);

  // Sync audio engine with store
  useEffect(() => {
    audioEngine?.setEnabled(enabled);
  }, [enabled]);
  useEffect(() => {
    audioEngine?.setVolume(volume);
  }, [volume]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => audioEngine?.dispose();
  }, []);

  return <>{children}</>;
}
