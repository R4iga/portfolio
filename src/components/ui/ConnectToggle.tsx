'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine } from '@/audio/engine';

/**
 * Interactive connect toggle — the "addicting" micro-interaction.
 * A status pill that flips between Available → Connected on click,
 * with a spring-green dot, border flash, and chip state change.
 *
 * Spring curve: cubic-bezier(.34,1.56,.64,1) — the overshoot
 * that makes it feel physical rather than digital.
 */
export function ConnectToggle({
  defaultConnected = false,
  onToggle,
}: {
  defaultConnected?: boolean;
  onToggle?: (connected: boolean) => void;
}) {
  const [connected, setConnected] = useState(defaultConnected);

  const toggle = useCallback(() => {
    const next = !connected;
    setConnected(next);
    onToggle?.(next);
    audioEngine?.playClick();
  }, [connected, onToggle]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="connect-toggle group relative flex items-center gap-3 rounded-xl px-5 py-3 font-mono text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: connected ? 'rgba(var(--success-rgb), 0.06)' : 'var(--glass-bg)',
        border: `1px solid ${
          connected
            ? 'rgba(var(--success-rgb), 0.28)'
            : 'var(--glass-border)'
        }`,
        boxShadow: connected
          ? '0 0 24px rgba(var(--success-rgb), 0.15), inset 0 1px rgba(255,255,255,0.05)'
          : 'inset 0 1px rgba(255,255,255,0.05)',
        cursor: 'pointer',
        color: connected ? 'rgb(134,239,172)' : 'rgba(255,255,255,0.65)',
        letterSpacing: '0.04em',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Dot with spring overshoot */}
      <AnimatePresence mode="wait">
        <motion.span
          key={connected ? 'on' : 'off'}
          className="block rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10,
            mass: 0.4,
          }}
          style={{
            width: 10,
            height: 10,
            background: connected ? 'var(--success)' : 'var(--muted-fg)',
            boxShadow: connected
              ? '0 0 10px rgba(var(--success-rgb), 0.7)'
              : 'none',
          }}
        />
      </AnimatePresence>

      {/* Label cross-fade */}
      <AnimatePresence mode="wait">
        <motion.span
          key={connected ? 'connected' : 'available'}
          className="block"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {connected ? 'Connected' : 'Available'}
        </motion.span>
      </AnimatePresence>

      {/* Hover lift border glow */}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: connected
            ? '0 0 40px rgba(var(--success-rgb), 0.25)'
            : '0 0 40px rgba(var(--accent-rgb), 0.15)',
        }}
      />
    </button>
  );
}
