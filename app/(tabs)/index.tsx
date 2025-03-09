import { useState, useEffect } from 'react';
import React, { useRef } from "react";
import { Platform, Text, View, StyleSheet, ScrollView, StatusBar, Button, TouchableOpacity, ImageBackground, Image } from 'react-native';

import * as Location from 'expo-location';

import * as Progress from 'react-native-progress';

import StationSquare from '@/components/StationSquare';

import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useGlobalState } from "../../context/GlobalContext";

import Toast from 'react-native-toast-message';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function App() {


  const scrollViewRef = useRef<ScrollView>(null); // Create a ref for ScrollView

  const scrollToPosition = (xValue: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: xValue, animated: true }); // Scroll to X position
    }
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Returns the distance in kilometers
  };

  const findNearestStationIndexToRight = (
    currentLat: number,
    currentLon: number,
    stations: { name: string; lat: number; lon: number }[]
  ): number => {
    // Find the closest station based on geographical location first
    let nearestIndex = 0;
    let minDistance = Infinity;
  
    for (let i = 0; i < stations.length; i++) {
      const distance = haversineDistance(currentLat, currentLon, stations[i].lat, stations[i].lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }
  
    // If the nearest station is the last one in the list, return it (no station to the right)
    if (nearestIndex >= stations.length - 1) {
      return nearestIndex;
    }
  
    // Otherwise, return the next station in the array (side-by-side order)
    return nearestIndex + 1;
  };

  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startStation, setStart] = useState(-1);

  const { destinationIndex, setDestinationIndex,
          direction, setDirection,
          nextStation, setNextStation,
          latitude,
          longitude,
          sbstations,
          nbstations
        } = useGlobalState();

  const stations = direction === "Southbound" ? sbstations : nbstations;
  const [hasScrolled, setHasScrolled] = useState(false); // Track if initial scroll happened

  useEffect(() => {
    if (nextStation != -1 && hasScrolled == false) {
      scrollToPosition(((nextStation - 1) * 250) + ((1 - ((haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat, stations[nextStation-1].lon, stations[nextStation].lat, stations[nextStation].lon)))) * 250));
      setHasScrolled(true);
    }
    // Call any function you need to run once
  }, [nextStation, latitude,longitude]);



 // Run when GPS is updated
  useEffect(() => {
    if (nextStation === -1 || longitude === 0 || latitude === 0) return; // Ensure valid values
  
    const thresholdDistance = 0.03; // 50 meters (converted from km)
    
    const currentNextStation = stations[nextStation]; // Get current next station
  
    if (!currentNextStation) return; // Safety check
  
    const distanceToNextStation = haversineDistance(
      latitude, longitude,
      currentNextStation.lat, currentNextStation.lon
    );
  
    if (distanceToNextStation <= thresholdDistance) {
      // Find the next nearest station to the right
      // const newNextStation = findNearestStationIndexToRight(latitude, longitude, stations);
      console.log('You are now at ' + stations[nextStation].name);
      setNextStation(nextStation + 1);
      scrollToPosition(((nextStation - 1) * 250) + ((1 - ((haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat, stations[nextStation-1].lon, stations[nextStation].lat, stations[nextStation].lon)))) * 250))
    }
  }, [latitude, longitude, nextStation]);

  return (
    <View style={styles.main}>
      <Toast />
      <View style={styles.header}>
        <Text style={styles.paragraph}>{destinationIndex==-1? 'Choose destination first,' : 'Next Bus Stop:'}</Text>
        <Text style={{fontSize: 30, color: 'black', textAlign: 'center'}}>{destinationIndex==-1? 'Welcome to EDSaan' : stations[nextStation].name}</Text>
        <Text style={{textAlign: 'center'}}>{latitude!=0? latitude + ' ' + longitude : 'Loading Location...'}</Text>
      </View>
      <View style={styles.mapContainer}>
        <ScrollView horizontal={true} alwaysBounceHorizontal={false} overScrollMode='never' style={{borderRadius: 10}}  ref={scrollViewRef}>
          <ImageBackground source={require('@/assets/images/backdrop.png')} resizeMode = 'repeat' resizeMethod='resize' style={styles.map}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {stations.map((station, index) => (
              <StationSquare key={index} text={station.name} direction={direction} index = {index}/>))}
            </View>
            <View style={{flexDirection: 'row', marginTop: 40}}>
            {stations.map((station, index) => (
              index == 0? <View key={index}></View> : <Progress.Bar progress={index==nextStation? 1 - (haversineDistance(latitude,longitude,stations[nextStation].lat, stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat,stations[nextStation-1].lon,stations[nextStation].lat, stations[nextStation].lon)) : nextStation > index? 1 : 0} width={250} height={5} color={'#FCD20F'} borderColor='#292929' borderWidth={1.2} borderRadius={0} key={index} unfilledColor='gray'/>))}
            <Progress.Bar progress={0} width={250} height={5} color={'#CF0921'} borderColor='#292929' borderWidth={1.2} borderRadius={0} unfilledColor='gray'/>
            </View>
            
            <Image
              style={{
                shadowColor: 'black',
                position: 'absolute',
                marginLeft: nextStation != -1? ((nextStation - 1) * 250) + ((1 - ((haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat, stations[nextStation-1].lon, stations[nextStation].lat, stations[nextStation].lon)))) * 250) : 0,
                height: 40,
                width: 80
              }}
              source={require('@/assets/images/bus.png')}/>
          </ImageBackground>
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginHorizontal: 10}}>
          <View style={styles.directionIndicator}><Text style={{color: 'black'}}>{direction=='Southbound'? 'Southbound' : 'Northbound'}</Text></View>
          <TouchableOpacity style={styles.directionIndicator} onPress={() => {scrollToPosition(((nextStation - 1) * 250) + ((1 - ((haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat, stations[nextStation-1].lon, stations[nextStation].lat, stations[nextStation].lon)))) * 250))}}><FontAwesome6 name="location-crosshairs" size={16} color="black" /><Text style={{color: 'black', fontWeight: 'bold'}}>  Locate Self</Text></TouchableOpacity>
          <View style={styles.directionIndicator}><Text style={{color: 'black'}}>{direction=='Southbound'? 'To PITX ▶' : 'To Monumento ▶'}</Text></View>
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
  directionIndicator: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});