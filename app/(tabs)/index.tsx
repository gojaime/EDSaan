import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView, StatusBar } from 'react-native';

import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';

import * as Progress from 'react-native-progress';

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
    <View style={styles.main}>
      <View style={styles.header}>
        <ThemedText style={styles.paragraph}>{text}</ThemedText>
      </View>
      <View style={styles.mapContainer}>
        <ScrollView horizontal={true} alwaysBounceHorizontal={false} overScrollMode='never'>
          <View style={styles.map}>
            <Progress.Bar progress={0.3} width={1500}/>
            <ThemedText>asdasdasfasfasfasfsdfasfasasfasdasdasdasdasdadadadasdasd the quick brown fox jumps over the lazy dog the quick brown gocz</ThemedText>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <ThemedText style={styles.paragraph}>{text}</ThemedText>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 25
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 25
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    justifyContent: 'center',
    backgroundColor: 'red'
    
  },
  mapContainer: {
    flex: 75,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
});