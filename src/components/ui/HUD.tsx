'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useExperience } from '@/store/experienceStore';
import { useAudio } from '@/store/audioStore';
import { audioEngine } from '@/audio/engine';
import { person } from '@/data/person';

const SECTIONS = ['Profile', 'Craft', 'Journey', 'Work', 'Connect'];

export function HUD() {
  const phase = useExperience((s) => s.phase);
  const section = useExperience((s) => s.section);
  const scrollProgress = useExperience((s) => s.scrollProgress);

  const audioEnabled = useAudio((s) => s.enabled);
  const setAudioEnabled = useAudio((s) => s.setEnabled);

  const show = phase === 'ready';

  const scrollTo = (i: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (i / 4) * max, behavior: 'smooth' });
    audioEngine?.playTransition('up');
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Top pill nav — centered, glass, unabyss-style */}
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-5 z-40 -translate-x-1/2"
          >
            <nav
              className="flex items-center gap-1 rounded-full py-2 pl-5 pr-2"
              style={{
                background: 'rgba(62, 62, 62, 0.33)',
                backdropFilter: 'blur(12px) saturate(1)',
                WebkitBackdropFilter: 'blur(12px) saturate(1)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px rgba(255,255,255,0.06)',
              }}
            >
              <span
                className="mr-3 hidden font-mono text-[11px] tracking-[0.3em] uppercase sm:block"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {person.name}
              </span>

              {SECTIONS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => scrollTo(i)}
                  className="relative rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-300"
                  style={{
                    color: section === i ? '#0f0f0f' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  {section === i && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: '#ffffff' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{s}</span>
                </button>
              ))}

              {/* Audio toggle inside pill */}
              <div className="ml-2 border-l pl-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <AudioToggle
                  enabled={audioEnabled}
                  onToggle={() => {
                    const next = !audioEnabled;
                    setAudioEnabled(next);
                    if (next) audioEngine?.playClick();
                  }}
                />
              </div>
            </nav>
          </motion.header>

          {/* Bottom progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="fixed inset-x-0 bottom-0 z-40 h-px"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <motion.div
              className="h-full"
              style={{
                width: `${scrollProgress * 100}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
              }}
            />
          </motion.div>

          {/* Scroll hint */}
          {scrollProgress < 0.02 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
              className="fixed inset-x-0 bottom-10 z-40 text-center font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Scroll ↓
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

function AudioToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? 'Mute audio' : 'Enable audio'}
      className="relative flex h-8 w-8 items-center justify-center rounded-full transition-colors"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full"
            animate={enabled ? { height: [3, 9, 5, 11, 3] } : { height: 3 }}
            transition={
              enabled
                ? { duration: 0.9, repeat: Infinity, delay: i * 0.12 }
                : { duration: 0.2 }
            }
            style={{
              height: 3,
              background: enabled ? 'var(--accent-light)' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
      {!enabled && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-6 w-px rotate-45" style={{ background: 'rgba(248,113,113,0.8)' }} />
        </span>
      )}
    </button>
  );
}
