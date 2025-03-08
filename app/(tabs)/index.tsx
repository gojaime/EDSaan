import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView, StatusBar, Button, TouchableOpacity, ImageBackground } from 'react-native';

import * as Location from 'expo-location';

import * as Progress from 'react-native-progress';

import StationSquare from '@/components/StationSquare';

import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useGlobalState } from "../../context/GlobalContext";

import Toast from 'react-native-toast-message';

export default function App() {

  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startStation, setStart] = useState(-1);

  const { destinationIndex, setDestinationIndex, direction, setDirection } = useGlobalState();

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
    {name: 'Balintawak', lat: 100, lon:400},
    {name: 'Kaingin Road', lat: 100, lon:400},
    {name: 'LRT 1- Roosevelt Station', lat: 100, lon:400},
    {name: 'MRT 3 North Avenue', lat: 100, lon:400},
    {name: 'MRT 3 Quezon Avenue', lat: 100, lon:400},
    {name: 'Nepa Q-Mart', lat: 100, lon:400},
    {name: 'Main Ave (Cubao)', lat: 100, lon:400},
    {name: 'MRT 3 Santolan Station', lat: 100, lon:400},
    {name: 'MRT 3 Ortigas Station', lat: 100, lon:400},
    {name: 'Guadalupe Bridge', lat: 100, lon:400},
    {name: 'MRT 3 Buendia Station', lat: 100, lon:400},
    {name: 'MRT 3 Ayala Station (curbside)', lat: 100, lon:400},
    {name: 'Taft Avenue', lat: 100, lon:400},
    {name: 'Roxas Boulevard', lat: 100, lon:400},
    {name: 'SM Mall of Asia (curbside)', lat: 100, lon:400},
    {name: 'Macapagal - DFA (curbside)', lat: 100, lon:400},
    {name: 'Macapagal - City of Dreams (curbside)', lat: 100, lon:400},
    {name: 'PITX', lat: 100, lon:400},
    
  ]

  return (
    <View style={styles.main}>
      <Toast />
      <View style={styles.header}>
        <Text style={styles.paragraph}>{destinationIndex==-1? 'Choose destination first,' : 'Next Bus Stop:'}</Text>
        <Text style={{fontSize: 30, color: 'black'}}>{destinationIndex==-1? 'Welcome to EDSaan' : stations[1].name}</Text>
        <Text style={{textAlign: 'center'}}>{'('+text+')'}</Text>
      </View>
      <View style={styles.mapContainer}>
        <ScrollView horizontal={true} alwaysBounceHorizontal={false} overScrollMode='never' style={{borderRadius: 10}}>
          <ImageBackground source={require('@/assets/images/backdrop.png')} resizeMode = 'repeat' resizeMethod='resize' style={styles.map}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {stations.map((station, index) => (
              <StationSquare key={index} text={station.name} direction={direction} />))}
            </View>
            <View style={{flexDirection: 'row', marginTop: 40}}>
            {stations.map((station, index) => (
              <Progress.Bar progress={0} width={250} height={5} color={'#CF0921'} borderColor='#292929' borderWidth={1.2} borderRadius={0} key={index} unfilledColor='gray'/>))}
            </View>
            <Text style={styles.busIcon}>🚌</Text>
          </ImageBackground>
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginHorizontal: 10}}>
          <View style={{backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5}}><Text style={{color: 'black'}}>{direction=='Southbound'? '◀ To Monumento' : '◀ To PITX'}</Text></View>
          <View style={{backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5}}><Text style={{color: 'black'}}>{direction=='Southbound'? 'Southbound' : 'Northbound'}</Text></View>
          <View style={{backgroundColor: '#f0f0f0', borderRadius: 10, padding: 5}}><Text style={{color: 'black'}}>{direction=='Southbound'? 'To PITX ▶' : 'To Monumento ▶'}</Text></View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={{flex: 80}}>
          <View style={{justifyContent: 'center', flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons name="bell" size={20} color="black" />
            <Text style={{color: 'black', fontSize: 13}}>Destination:</Text>
          </View>
        <Text style={{color: 'black', textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>{destinationIndex == -1? 'Set your route first' : stations[destinationIndex].name}</Text>
        </View>
        <TouchableOpacity style={styles.stationsButton}   onPress={() => {router.push({ pathname: "/explore", params: { post: ""} });}}>
          <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>{'⇄ Change Route'}</Text>
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
    backgroundColor: 'white',
    alignSelf: 'stretch',
    marginHorizontal: 10,
    borderRadius: 10
  },
  footer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginHorizontal: 10,
    flex: 15,
    backgroundColor: '#FCD20F',
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
    backgroundColor: '#0038A8',
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