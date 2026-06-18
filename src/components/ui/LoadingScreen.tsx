'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useExperience } from '@/store/experienceStore';
import { useAudio } from '@/store/audioStore';
import { audioEngine } from '@/audio/engine';
import { person } from '@/data/person';

/**
 * Full-screen gate. Brief warmup progress, then an Enter button that
 * unlocks the AudioContext within the user gesture.
 */
export function LoadingScreen() {
  const phase = useExperience((s) => s.phase);
  const setPhase = useExperience((s) => s.setPhase);
  const setEntered = useExperience((s) => s.setEntered);
  const setAudioStarted = useAudio((s) => s.setStarted);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const tRef = useRef<number | null>(null);

  // Brief warmup progress
  useEffect(() => {
    let p = 0;
    const tick = () => {
      p += Math.random() * 0.12 + 0.04;
      if (p >= 1) {
        p = 1;
        setProgress(1);
        setReady(true);
        return;
      }
      setProgress(p);
      tRef.current = window.setTimeout(tick, 70 + Math.random() * 90);
    };
    tRef.current = window.setTimeout(tick, 200);
    return () => {
      if (tRef.current) clearTimeout(tRef.current);
    };
  }, []);

  const enter = async () => {
    try {
      await audioEngine?.unlock();
      setAudioStarted(true);
    } catch {
      /* audio optional */
    }
    setEntered(true);
    audioEngine?.playClick();
    setPhase('intro');
    window.setTimeout(() => setPhase('ready'), 2400);
  };

  const visible = phase === 'boot' || phase === 'intro';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: 'var(--bg)' }}
        >
          {/* radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.12), transparent 55%)',
            }}
          />

          {phase === 'boot' ? (
            <motion.div
              key="boot"
              className="relative flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="mb-3 font-mono text-[10px] tracking-[0.3em] uppercase"
                style={{ color: 'var(--accent-light)' }}
              >
                {person.location}
              </p>
              <h1
                className="h-display text-center"
                style={{ fontSize: 'clamp(36px, 8vw, 80px)' }}
              >
                {person.name}
              </h1>

              <div className="mt-10 w-64 max-w-[60vw]">
                <div
                  className="mb-3 flex justify-between font-mono text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  <span>Preparing</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div
                  className="h-px w-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <motion.div
                    className="h-full"
                    style={{
                      width: `${progress * 100}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                    }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {ready && (
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={enter}
                    className="btn-primary mt-12"
                  >
                    Enter
                  </motion.button>
                )}
              </AnimatePresence>

              <p
                className="mt-6 max-w-xs text-center font-mono text-[10px] leading-relaxed tracking-[0.2em] uppercase"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {ready
                  ? 'Audio enabled · headphones recommended'
                  : 'Loading space'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="intro"
              className="relative flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, times: [0, 0.2, 0.8, 1] }}
            >
              <motion.h1
                initial={{ letterSpacing: '0.5em', opacity: 0, filter: 'blur(16px)' }}
                animate={{ letterSpacing: '-0.022em', opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-display"
                style={{ fontSize: 'clamp(40px, 9vw, 96px)' }}
              >
                {person.name}
              </motion.h1>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
