import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView, StatusBar, Button, TouchableOpacity, ImageBackground } from 'react-native';

import * as Location from 'expo-location';

import * as Progress from 'react-native-progress';

import StationSquare from '@/components/StationSquare';

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

  const stations =[
    {name: 'Monumento', lat: 100, lon:200},
    {name: 'Bagong Barrio', lat: 100, lon:300},
    {name: 'Station 3', lat: 100, lon:400},
    {name: 'Station 3', lat: 100, lon:400},
    {name: 'Station 3', lat: 100, lon:400},
    {name: 'Station 3', lat: 100, lon:400},
    {name: 'los pollos hermanos the best chicken', lat: 100, lon:400},
    {name: 'Station 3', lat: 100, lon:400},
    {name: 'PITX', lat: 100, lon:400}
  ]

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.paragraph}>Next Station:</Text>
        <Text style={{fontSize: 30, color: 'black'}}>{stations[1].name}</Text>
        <Text>{text}</Text>
      </View>
      <View style={styles.mapContainer}>
        <ScrollView horizontal={true} alwaysBounceHorizontal={false} overScrollMode='never' style={{borderRadius: 10}}>
          <ImageBackground source={require('@/assets/images/backdrop.png')} resizeMode = 'repeat' resizeMethod='resize' style={styles.map}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {stations.map((station, index) => (
              <StationSquare key={index} text={station.name} />))}
            </View>
            <View style={{flexDirection: 'row', marginTop: 40}}>
            {stations.map((station, index) => (
              <Progress.Bar progress={0} width={250} height={5} color={'#CF0921'} borderColor='#292929' borderWidth={1.2} borderRadius={0} key={index} unfilledColor='gray'/>))}
            </View>
            <Text style={styles.busIcon}>🚌</Text>
          </ImageBackground>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <View style={{flex: 80}}>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 13}}>Destination:</Text>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>🏁 {stations[8].name}</Text>
        </View>
        <TouchableOpacity style={styles.stationsButton}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>⇄ Change Destination</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 50,
  },
  footer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 15,
    backgroundColor: '#CF0921',
    borderRadius: 10,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    justifyContent: 'flex-end',
    height: '100%'
    
  },
  mapContainer: {
    flex: 25,
    margin: 10
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'white'
  },
  stationsButton: {
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
    flex: 30,
    alignSelf: 'stretch',
    marginVertical: 'auto'
  },
  busIcon: {
    textShadowColor: 'blue',
    textShadowRadius: 3,
    fontSize:40,
    shadowColor: 'black',
    transform: [{ scaleX: -1 }],
    position: 'absolute',
    marginLeft: 30
  }
});