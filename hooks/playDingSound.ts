import { Audio } from 'expo-av';
import { useRef } from 'react';

export const useDingSound = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playDingSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync(); // play again if already loaded
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('@/assets/sounds/ding.mp3'), // update path if needed
      { shouldPlay: true }
    );

    soundRef.current = sound;
  };

  const stopDingSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
  };

  return { playDingSound, stopDingSound };
};