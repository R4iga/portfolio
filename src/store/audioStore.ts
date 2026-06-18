'use client';

import { create } from 'zustand';

interface AudioState {
  enabled: boolean; // user wants audio on
  volume: number; // 0..1 master
  started: boolean; // audio context has been unlocked
  setEnabled: (v: boolean) => void;
  setVolume: (v: number) => void;
  setStarted: (v: boolean) => void;
}

const initialEnabled =
  typeof window !== 'undefined'
    ? localStorage.getItem('signal-audio-enabled') !== 'false'
    : true;

export const useAudio = create<AudioState>((set) => ({
  enabled: initialEnabled,
  volume: 0.6,
  started: false,
  setEnabled: (enabled) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('signal-audio-enabled', String(enabled));
    }
    set({ enabled });
  },
  setVolume: (volume) => set({ volume }),
  setStarted: (started) => set({ started }),
}));
