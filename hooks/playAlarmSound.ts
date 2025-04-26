import { Audio } from 'expo-av';
import { useRef } from 'react';

const useAlarmSound = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlarmSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync(); // play again if already loaded
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/alarm.mp3'), // update path if needed
      { shouldPlay: true }
    );

    soundRef.current = sound;
  };

  const stopAlarmSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
  };

  return { playAlarmSound, stopAlarmSound };
};