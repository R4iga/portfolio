'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { audioEngine } from '@/audio/engine';
import { person } from '@/data/person';
import { Reveal } from './Reveal';
import { Terminal } from './Terminal';
import { ConnectToggle } from './ConnectToggle';
import { TokenStream } from './TokenStream';

/**
 * The scrollable page. Five sections, unabyss-grade restraint:
 * Profile → Craft → Journey → Selected Work → Connect
 */
export function Sections() {
  return (
    <main className="relative z-10">
      <ProfileSection />
      <CraftSection />
      <JourneySection />
      <ProjectsSection />
      <WorkSection />
      <ConnectSection />
    </main>
  );
}

const MAX_WIDTH = 'mx-auto w-full max-w-[1100px] px-6 md:px-10';

/* ─────────────────────── SECTION 1 · PROFILE ─────────────────────── */
function ProfileSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={ref}
      className="flex min-h-screen flex-col items-center justify-center px-6 py-32"
    >
      <motion.div style={{ opacity, y }} className="flex flex-col items-center text-center">
        <Reveal once={false}>
          <div className="chip mb-10">
            <span className="dot dot-accent" />
            <span>{person.location} · {person.status}</span>
          </div>
        </Reveal>

        <motion.h1
          initial={{ opacity: 0, y: 32, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="h-display"
          style={{ fontSize: 'clamp(48px, 11vw, 140px)' }}
        >
          {person.name}
        </motion.h1>

        <Reveal delay={0.2}>
          <p className="mt-7 font-mono text-xs tracking-[0.22em] uppercase" style={{ color: 'var(--accent-light)' }}>
            {person.title}
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-8 max-w-xl text-[15px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {person.bio}
          </p>
        </Reveal>

        <Reveal delay={0.5} className="mt-14 flex w-full justify-center">
          <Terminal />
        </Reveal>

        <Reveal delay={0.6}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://discord.com/users/${person.contact.discordId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onMouseEnter={() => audioEngine?.playHover()}
              onClick={() => audioEngine?.playClick()}
            >
              Connect on Discord
            </a>
            <button
              className="btn-ghost"
              onMouseEnter={() => audioEngine?.playHover()}
              onClick={() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({ top: max * 0.5, behavior: 'smooth' });
                audioEngine?.playClick();
              }}
            >
              View work ↓
            </button>
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ─────────────────────── SECTION 2 · CRAFT ─────────────────────── */
function CraftSection() {
  return (
    <section className="relative overflow-hidden px-0 py-[clamp(100px,18vw,220px)]">
      <TokenStream />

      <div className={`relative ${MAX_WIDTH}`}>
        <Reveal>
          <p className="kicker kicker-accent mb-5">01 / Craft</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="h-display mb-6" style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}>
            What I build with
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mb-16 max-w-xl text-[15px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tools, frameworks, and ways of thinking I reach for when the problem
            calls for automation, interfaces, or a bit of both.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {person.skills.map((s, i) => (
            <Reveal key={s.n} delay={0.1 + i * 0.06}>
              <div
                className="surface group h-full rounded-2xl p-7"
                onMouseEnter={() => audioEngine?.playHover()}
              >
                <div
                  className="mb-5 font-mono text-[11px] tracking-[0.22em] uppercase"
                  style={{ color: 'var(--accent-light)' }}
                >
                  {s.n}
                </div>
                <h3 className="mb-3 font-display text-[18px] font-medium" style={{ letterSpacing: '-0.015em' }}>
                  {s.t}
                </h3>
                <p className="text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {s.d}
                </p>
                <span
                  className="mt-6 block h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-toggle group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, var(--accent), transparent)` }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 3 · JOURNEY ─────────────────────── */
function JourneySection() {
  return (
    <section className="px-0 py-[clamp(100px,18vw,220px)]">
      <div className={MAX_WIDTH}>
        <Reveal>
          <p className="kicker kicker-accent mb-5">02 / Journey</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="h-display mb-16" style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}>
            Where I&apos;ve been
          </h2>
        </Reveal>

        <div className="relative ml-2 border-l md:ml-4" style={{ borderColor: 'var(--border)' }}>
          {person.journey.map((j, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="relative pl-8 pb-12 last:pb-0 md:pl-12">
                <span
                  className="absolute top-[6px] rounded-full"
                  style={{
                    left: i === 0 ? -8 : -7,
                    width: i === 0 ? 16 : 14,
                    height: i === 0 ? 16 : 14,
                    background: 'var(--bg)',
                    border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                />
                {i === 0 && (
                  <span
                    className="absolute top-[6px] rounded-full"
                    style={{
                      left: -8,
                      width: 16,
                      height: 16,
                      background: 'var(--accent)',
                      animation: 'pulse-ring 2.4s ease-in-out infinite',
                    }}
                  />
                )}

                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                  <span className="shrink-0 font-mono text-[11px] tracking-[0.22em] uppercase" style={{ color: 'var(--accent-light)' }}>
                    {j.year}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-medium" style={{ letterSpacing: '-0.015em' }}>
                      {j.role}
                    </h3>
                    <span className="font-mono text-[12px] tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {j.place}
                    </span>
                  </div>
                </div>
                <p className="mt-2 max-w-xl text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {j.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 3.5 · PROJECTS ─────────────────────── */
function ProjectsSection() {
  return (
    <section className="px-0 py-[clamp(100px,18vw,220px)]">
      <div className={MAX_WIDTH}>
        <Reveal>
          <p className="kicker kicker-accent mb-5">03 / Projects</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="h-display mb-6" style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}>
            Things I&apos;ve built
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mb-12 max-w-xl text-[15px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Real projects, live and clickable. No placeholders.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {person.projects.map((p, i) => (
            <Reveal key={p.name} delay={0.1 + i * 0.08}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface group relative flex h-full items-start gap-5 rounded-2xl p-7"
                onMouseEnter={() => audioEngine?.playHover()}
                onClick={() => audioEngine?.playClick()}
              >
                {/* Live indicator */}
                <div
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `${p.c}1a`,
                    border: `1px solid ${p.c}33`,
                  }}
                >
                  <span className="pulse-dot inline-block h-2 w-2 rounded-full" style={{ background: p.c, boxShadow: `0 0 8px ${p.c}` }} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-3">
                    <h3 className="font-display text-[20px] font-semibold" style={{ color: p.c }}>
                      {p.name}
                    </h3>
                    <span
                      className="mono text-[9px] tracking-[0.18em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {p.desc}
                  </p>
                  <span className="mt-4 inline-block mono text-[10px] tracking-[0.15em] uppercase opacity-50 transition-opacity group-hover:opacity-100" style={{ color: p.c }}>
                    Open ↗
                  </span>
                </div>
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-toggle group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, ${p.c}, transparent)` }}
                />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 4 · STACK ─────────────────────── */
function WorkSection() {
  return (
    <section className="px-0 py-[clamp(100px,18vw,220px)]">
      <div className={MAX_WIDTH}>
        <Reveal>
          <p className="kicker kicker-accent mb-5">04 / Stack</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="h-display mb-6" style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}>
            The tools I build with
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mb-16 max-w-xl text-[15px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Open-source frameworks I reach for when shipping automation, agents,
            and interfaces. Each links to the real source.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {person.stack.map((t, i) => (
            <Reveal key={t.name} delay={0.08 + i * 0.06}>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface group relative flex h-full flex-col rounded-2xl p-6"
                onMouseEnter={() => audioEngine?.playHover()}
                onClick={() => audioEngine?.playClick()}
              >
                {/* Header: name + lang badge */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-display text-[18px] font-medium" style={{ letterSpacing: '-0.015em' }}>
                    {t.name}
                  </h3>
                  <span
                    className="shrink-0 font-mono text-[10px] tracking-[0.12em] uppercase"
                    style={{
                      color: t.c,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: `${t.c}1a`,
                      border: `1px solid ${t.c}33`,
                    }}
                  >
                    {t.lang}
                  </span>
                </div>

                <p className="mb-6 text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {t.desc}
                </p>

                {/* Footer: category tag + open affordance */}
                <div className="mt-auto flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {t.tag}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-[0.15em] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{ color: t.c }}
                  >
                    Source ↗
                  </span>
                </div>

                {/* Accent top border on hover */}
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-toggle group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, ${t.c}, transparent)` }}
                />
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {person.stats.map((s, i) => (
            <Reveal key={s.l} delay={0.05 + i * 0.05}>
              <div className="surface-solid rounded-2xl p-6 text-center" onMouseEnter={() => audioEngine?.playHover()}>
                <div className="font-display text-[32px] font-semibold" style={{ letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {s.v}
                </div>
                <div className="mt-1 font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: 'var(--accent-light)' }}>
                  {s.u}
                </div>
                <div className="mt-2 text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {s.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── SECTION 5 · CONNECT ─────────────────────── */
function ConnectSection() {
  const [sent, setSent] = useState(false);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-32">
      <div className="w-full max-w-lg">
        <Reveal className="text-center">
          <p className="kicker kicker-accent mb-5">04 / Connect</p>
        </Reveal>
        <Reveal delay={0.08} className="text-center">
          <h2 className="h-display mb-4" style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}>
            Let&apos;s talk
          </h2>
        </Reveal>
        <Reveal delay={0.16} className="text-center">
          <p className="mb-14 text-[14px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {person.location} · {person.status}
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mb-5 flex justify-center">
          <ConnectToggle onToggle={(c) => c && audioEngine?.playTransition('up')} />
        </Reveal>

        <Reveal delay={0.3} className="mb-5">
          <a
            href={`https://discord.com/users/${person.contact.discordId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="surface group flex items-center gap-4 rounded-2xl p-5"
            onMouseEnter={() => audioEngine?.playHover()}
            onClick={() => audioEngine?.playClick()}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                boxShadow: '0 0 20px rgba(88,101,242,0.3)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-display text-[15px] font-medium">Discord</div>
              <div className="font-mono text-[12px] tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {person.contact.discord}
              </div>
            </div>
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-30 transition-opacity group-hover:opacity-70" style={{ color: 'var(--accent-light)' }}>
              Open →
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.36}>
          <div className="surface rounded-2xl p-7">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full text-xl"
                  style={{
                    background: 'rgba(var(--success-rgb), 0.1)',
                    border: '1px solid rgba(var(--success-rgb), 0.3)',
                    color: 'var(--success)',
                  }}
                >
                  ✓
                </div>
                <h3 className="font-display text-[17px] font-medium">Message received</h3>
                <p className="mt-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  I&apos;ll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  audioEngine?.playTransition('up');
                  setSent(true);
                }}
                className="space-y-4"
              >
                <Field label="Name" name="name" placeholder="Your name" />
                <Field label="Discord / Email" name="contact" placeholder="how to reach you" />
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What's on your mind?"
                    className="w-full resize-none rounded-xl px-4 py-3 text-[14px] outline-none transition-all placeholder:opacity-30"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(var(--accent-rgb), 0.5)';
                      e.target.style.boxShadow = '0 0 24px rgba(var(--accent-rgb), 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.42}>
          <p className="mt-12 text-center font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {person.name} · {person.location} · {new Date().getFullYear()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </label>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all placeholder:opacity-30"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(var(--accent-rgb), 0.5)';
          e.target.style.boxShadow = '0 0 24px rgba(var(--accent-rgb), 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
