'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { person } from '@/data/person';
import { ConnectToggle } from './ConnectToggle';
import { audioEngine } from '@/audio/engine';

/**
 * Hero terminal mockup.
 * Types `$ npx raigardas --connect` char-by-char, then reveals
 * a success chip and ConnectToggle. Loops after a pause.
 */
const COMMAND = '$ npx raigardas --connect';
const CHAR_DELAY = 55; // ms per char
const HOLD_DELAY = 4000; // pause at end before loop
const CLEAR_DELAY = 800;

export function Terminal() {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const reset = useCallback(() => {
    setDisplayed('');
    setDone(false);
    setClearing(false);
    setCharIdx(0);
  }, []);

  // Typing loop
  useEffect(() => {
    if (clearing) return;

    if (charIdx < COMMAND.length) {
      // Still typing
      timerRef.current = setTimeout(() => {
        setDisplayed(COMMAND.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, CHAR_DELAY + (Math.random() * 30 - 15)); // slight humanize
    } else if (charIdx === COMMAND.length && !done) {
      // Just finished typing — mark done, play sound
      setDone(true);
      audioEngine?.playTransition('up');
      // Hold, then clear and loop
      timerRef.current = setTimeout(() => {
        setClearing(true);
      }, HOLD_DELAY);
    }

    return () => clearTimeout(timerRef.current);
  }, [charIdx, done, clearing]);

  // Clear animation
  useEffect(() => {
    if (!clearing) return;
    timerRef.current = setTimeout(reset, CLEAR_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [clearing, reset]);

  return (
    <div
      className="surface-solid rounded-2xl p-6 font-mono text-sm transition-opacity duration-[var(--clear-duration,800ms)]"
      style={{
        opacity: clearing ? 0 : 1,
        '--clear-duration': `${CLEAR_DELAY}ms`,
        minWidth: 320,
        maxWidth: 520,
        width: '100%',
      } as React.CSSProperties}
    >
      {/* Terminal header bar */}
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
        <span className="inline-block h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-3 text-[10px] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>
          terminal
        </span>
      </div>

      {/* Terminal body */}
      <div className="min-h-[60px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <div className="flex items-start gap-0">
          <span style={{ color: 'var(--accent-light)', whiteSpace: 'pre' }}>
            {displayed}
          </span>
          <span className="blink-cursor" />
        </div>

        {/* Success output after typing completes */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2" style={{ color: 'rgba(134,239,172,0.9)' }}>
                <span style={{ color: 'var(--success)' }}>✓</span>
                <span style={{ fontSize: '12px' }}>
                  Connected — Discord: <span style={{ color: 'rgba(255,255,255,0.5)' }}>{person.contact.discord}</span>
                </span>
              </div>
              <ConnectToggle defaultConnected onToggle={(c) => {
                if (c) audioEngine?.playHover();
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
