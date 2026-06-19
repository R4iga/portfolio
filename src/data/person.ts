/**
 * ─────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH — edit this file to update the whole site.
 * ─────────────────────────────────────────────────────────────
 */

export const person = {
  name: 'Raigardas',

  title: 'Creative Developer · AI Automation',
  tagline: 'IT student crafting tools that make automation effortless.',
  bio: 'I build AI-driven systems that turn repetitive work into one click. Currently studying IT in Vilnius, experimenting with agents, scripts, and interfaces that feel less like software and more like an extra pair of hands.',

  location: 'Vilnius, LT',
  status: 'Open to opportunities',

  skills: [
    { n: '01', t: 'AI Automation', d: 'Designing agents and pipelines that remove manual busywork end-to-end.', c: '#3b82f6' },
    { n: '02', t: 'Python & Tooling', d: 'Scripts, scrapers, and backends that glue services together.', c: '#22d3ee' },
    { n: '03', t: 'Web Interfaces', d: 'React, Next.js, and a love for motion and clean UX.', c: '#8b5cf6' },
    { n: '04', t: 'Systems Thinking', d: 'Breaking messy problems into reliable, automated flows.', c: '#60a5fa' },
    { n: '05', t: 'Creative Coding', d: 'WebGL, shaders, and interactive experiments on the side.', c: '#a78bfa' },
  ],

  journey: [
    {
      year: 'Now',
      role: 'IT Student & Builder',
      place: 'Vilnius',
      desc: 'Studying information technology while shipping AI automation tools and side projects.',
    },
    {
      year: '—',
      role: 'AI Automation Projects',
      place: 'Independent',
      desc: 'Building agents and workflows that compress hours of manual work into single actions.',
    },
    {
      year: '—',
      role: 'Web & Creative Coding',
      place: 'Self-taught',
      desc: 'Exploring React, Three.js, and design — making interfaces that move and respond.',
    },
  ],

  /**
   * The stack I build with — real, open-source tools/frameworks I actually use.
   * Each links to the real repo. Descriptions are accurate to what each tool IS
   * (not claimed as my own work). Section heading frames this as "tools I use".
   */

  /**
   * Things I've actually built. Each is a real project of mine with a live link.
   * (This is the honest "shipped" section — only real work goes here.)
   */
  projects: [
    {
      name: 'Personal OS',
      desc: 'A cyberpunk command-center dashboard — live clock, real weather, persistent notes, and a Cmd+K command bar. A tool I actually use every day.',
      tag: 'Live demo',
      url: 'https://personal-os-two-psi.vercel.app',
      c: '#00ffc6',
    },
    {
      name: 'Moodstrip',
      desc: 'A daily mood ritual — 15 real emotional states become a colored horizon of your year. 100% local, no backend.',
      tag: 'Live demo',
      url: 'https://moodstrip.vercel.app',
      c: '#f5a623',
    },
  ],

  stack: [
    {
      name: 'LangChain',
      desc: 'Framework for building agents & chaining LLMs with tools and data.',
      lang: 'Python',
      tag: 'Agents',
      url: 'https://github.com/langchain-ai/langchain',
      c: '#3b82f6',
    },
    {
      name: 'CrewAI',
      desc: 'Orchestrates role-playing, autonomous AI agents that collaborate.',
      lang: 'Python',
      tag: 'Multi-agent',
      url: 'https://github.com/crewAIInc/crewAI',
      c: '#8b5cf6',
    },
    {
      name: 'n8n',
      desc: 'Workflow automation — 400+ integrations with the flexibility of code.',
      lang: 'TypeScript',
      tag: 'Automation',
      url: 'https://github.com/n8n-io/n8n',
      c: '#22d3ee',
    },
    {
      name: 'Next.js',
      desc: 'React framework for production web apps. What this site is built on.',
      lang: 'TypeScript',
      tag: 'Web',
      url: 'https://github.com/vercel/next.js',
      c: '#a78bfa',
    },
    {
      name: 'FastAPI',
      desc: 'Fast Python backend for APIs that automation scripts talk to.',
      lang: 'Python',
      tag: 'Backend',
      url: 'https://github.com/tiangolo/fastapi',
      c: '#60a5fa',
    },
    {
      name: 'Three.js',
      desc: 'WebGL toolkit for creative coding — shaders, 3D, interactive visuals.',
      lang: 'JavaScript',
      tag: 'Creative',
      url: 'https://github.com/mrdoob/three.js',
      c: '#7c5cff',
    },
  ],

  stats: [
    { v: '∞', u: 'ITERATIONS', l: 'Always shipping' },
    { v: 'AI', u: 'FIRST', l: 'Automation mindset' },
    { v: '24/7', u: 'UPTIME', l: 'Tools that run themselves' },
    { v: '100%', u: 'CURIOSITY', l: 'Never stop learning' },
  ],

  contact: {
    discord: 'ra1g4',
    discordId: '1486654127646965820',
    location: 'Vilnius, Lithuania',
    cta: 'Message on Discord',
  },
} as const;

export type Person = typeof person;
