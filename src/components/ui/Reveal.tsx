'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface Props extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  /** Apply only once (viewport once) */
  once?: boolean;
}

/**
 * Scroll-reveal wrapper. Uses the unabyss reveal curve:
 * translateY(28px) + opacity 0 → origin, over 1.2s.
 */
export function Reveal({ children, delay = 0, once = true, className = '', ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8%' }}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
