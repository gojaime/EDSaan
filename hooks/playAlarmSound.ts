import { Audio } from 'expo-av';
import { useRef } from 'react';

const useAlarmSound = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlarmSound = async () => {
    try {
      // If a sound is already loaded, stop and unload it first
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Load and play new sound
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/alarm.mp3'),
        {
          shouldPlay: true,
          isLooping: true,
        }
      );

      soundRef.current = sound;
    } catch (error) {
      console.log('Error playing alarm sound:', error);
    }
  };

  const stopAlarmSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.setIsLoopingAsync(false);
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
