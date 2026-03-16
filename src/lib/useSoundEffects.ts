'use client';

import { useCallback, useRef } from 'react';

type ToneType = 'tap' | 'open' | 'success' | 'remove';

export function useSoundEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;

    if (!audioCtxRef.current) {
      const Context = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Context) return null;
      audioCtxRef.current = new Context();
    }

    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }

    return audioCtxRef.current;
  }, []);

  const play = useCallback((type: ToneType) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    const presets: Record<ToneType, { frequency: number; duration: number; wave: OscillatorType }> = {
      tap: { frequency: 540, duration: 0.06, wave: 'triangle' },
      open: { frequency: 680, duration: 0.08, wave: 'sine' },
      success: { frequency: 760, duration: 0.12, wave: 'triangle' },
      remove: { frequency: 240, duration: 0.1, wave: 'square' },
    };

    const preset = presets[type];
    oscillator.type = preset.wave;
    oscillator.frequency.setValueAtTime(preset.frequency, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.08, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + preset.duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + preset.duration);
  }, [getAudioContext]);

  return { play };
}

