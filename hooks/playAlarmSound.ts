import { Audio } from 'expo-av';
import { useRef } from 'react';

const useAlarmSound = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlarmSound = async () => {
    if (soundRef.current) {
      await soundRef.current.replayAsync();
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/alarm.mp3'),
      {
        shouldPlay: true,
        isLooping: true,
      }
    );

    soundRef.current = sound;
  };

  const stopAlarmSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.setIsLoopingAsync(false);
        await soundRef.current.pauseAsync();
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.log('Error stopping alarm sound:', error);
      } finally {
        soundRef.current = null;
      }
    }
  };

  return { playAlarmSound, stopAlarmSound };
};

export { useAlarmSound };
