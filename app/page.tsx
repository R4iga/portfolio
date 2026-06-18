'use client';

import { Providers } from '@/components/Providers';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { HUD } from '@/components/ui/HUD';
import { Sections } from '@/components/ui/Sections';

export default function Home() {
  return (
    <Providers>
      {/* Loading / intro gate (audio unlock) */}
      <LoadingScreen />

      {/* Main scrollable content */}
      <Sections />

      {/* Persistent nav + progress + audio toggle */}
      <HUD />
    </Providers>
  );
}
