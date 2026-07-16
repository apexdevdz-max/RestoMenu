import { useRef, useCallback, useState } from 'react';

export function useNotificationSound() {
  const audioRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      // Create a simple notification beep using AudioContext
      audioRef.current = {
        play: async () => {
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Two-tone notification
            const playTone = (freq, start, duration) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = freq;
              osc.type = 'sine';
              gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
              gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
              osc.start(ctx.currentTime + start);
              osc.stop(ctx.currentTime + start + duration);
            };
            playTone(880, 0, 0.15);
            playTone(1100, 0.18, 0.15);
            playTone(880, 0.36, 0.2);
            setNeedsInteraction(false);
          } catch {
            setNeedsInteraction(true);
          }
        }
      };
    }
  }, []);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    initAudio();
    audioRef.current?.play();
  }, [soundEnabled, initAudio]);

  const enableSound = useCallback(() => {
    initAudio();
    // Play a silent tone to unlock audio
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0;
      osc.start();
      osc.stop(ctx.currentTime + 0.01);
      setNeedsInteraction(false);
    } catch { /* ignore */ }
  }, [initAudio]);

  return { playSound, soundEnabled, setSoundEnabled, needsInteraction, enableSound };
}
