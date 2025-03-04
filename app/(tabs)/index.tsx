import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // const [lat,setLatitude] = useState<string | null | undefined>(null);
  // const [lon,setLongitude] = useState<string | null | undefined>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }

    // Initial fetch
    getCurrentLocation();

    // Update every 5 seconds
    interval = setInterval(() => {
      getCurrentLocation();
    }, 1000);
  }, []);

  let text = 'Loading location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = location.coords.latitude.toString() + " " + location.coords.longitude.toString();
  }


  return (
    <View style={styles.container}>
      <ThemedText style={styles.paragraph}>{text}</ThemedText>
      <ThemedText></ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});