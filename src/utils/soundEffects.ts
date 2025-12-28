// Sound effects utility using Web Audio API

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playSoundEffect = (type: 'success' | 'alert' | 'neutral') => {
  // Check if sound is enabled in settings
  const soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // default true
  
  if (!soundEnabled || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configure sound based on type
  switch (type) {
    case 'success':
      // Pleasant "ding" sound - C major chord
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.05); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      break;

    case 'alert':
      // Soft alert sound
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(466.16, audioContext.currentTime + 0.1); // A#4
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      break;

    case 'neutral':
      // Gentle click
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      break;
  }

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

export const isSoundEnabled = (): boolean => {
  return localStorage.getItem('soundEnabled') !== 'false';
};

export const setSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem('soundEnabled', String(enabled));
};
