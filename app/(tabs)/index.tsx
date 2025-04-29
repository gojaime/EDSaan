import { useState, useEffect } from 'react';
import React, { useRef } from "react";
import { Platform, Text, View, StyleSheet, ScrollView, StatusBar, Button, TouchableOpacity, ImageBackground, Image, Vibration } from 'react-native';

import * as Location from 'expo-location';

import * as Progress from 'react-native-progress';

import StationSquare from '@/components/StationSquare';

import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useGlobalState } from "../../context/GlobalContext";
import Entypo from '@expo/vector-icons/Entypo';

import Toast from 'react-native-toast-message';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { sbstations } from '@/constants/Stations';
import { nbstations } from '@/constants/Stations';
import { useAlarmSound } from '@/hooks/playAlarmSound';
import { useDingSound } from '@/hooks/playDingSound';

export default function App() {

  const { playAlarmSound, stopAlarmSound } = useAlarmSound();
  const { playDingSound, stopDingSound } = useDingSound();
  


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


  
  

  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [startStation, setStart] = useState(-1);
  const [arrive, setArrive] = useState(false);

  const { destinationIndex, setDestinationIndex,
          direction, setDirection,
          nextStation, setNextStation,
          latitude,
          longitude,
          currentStation, setCurrentStation,
          currentNearStation, setCurrentNearStation,
          vibrate,
          ring,
          stationBefore,
          alarmPlayed, setAlarmPlayed
        } = useGlobalState();

  const stations = direction === "Southbound" ? sbstations : nbstations;

  const findNearestStation = (latitude: number, longitude: number, stations: { lat: number; lon: number }[]) => {
    if (stations.length === 0) return null; // Return null if no stations exist
  
    let nearestIndex = 0;
    let minDistance = haversineDistance(latitude, longitude, stations[0].lat, stations[0].lon);
  
    stations.forEach((station, index) => {
      const distance = haversineDistance(latitude, longitude, station.lat, station.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });
  
    return minDistance <= 0.1 ? nearestIndex : null; // Return index if within 0.1 km, else null
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

  const refreshVars = () => {
    // setCurrentStation(null);
    // setNextStation(-1);
    // setArrive(false);

    const nearestNextStation = findNearestStationIndexToRight(latitude, longitude, stations)

      setNextStation(nearestNextStation);
      if (nextStation == stations.length - 1){
        setCurrentStation(nearestNextStation);
      }
      else{
        setCurrentStation(nearestNextStation - 1);
      }

      scrollToPosition(nextStation !== -1 
        ? ((nextStation - 1) * 250) + (
            ((1 - (haversineDistance(latitude, longitude, stations[nextStation].lat, stations[nextStation].lon) / 
            haversineDistance(stations[nextStation - 1].lat, stations[nextStation - 1].lon, stations[nextStation].lat, stations[nextStation].lon))) * 250) < 1 
              ? 0 
              : ((1 - (haversineDistance(latitude, longitude, stations[nextStation].lat, stations[nextStation].lon) / 
              haversineDistance(stations[nextStation - 1].lat, stations[nextStation - 1].lon, stations[nextStation].lat, stations[nextStation].lon))) * 250) - 100
          ) 
        : 0)
    }




  // update nearest everytime gps is updated
  useEffect(() => {

    if(destinationIndex == -1){
      stopAlarmSound();
      setAlarmPlayed(false);
    }
    if (latitude !== 0 || longitude !== 0) {

      // set currentNeareststation if meron
      setCurrentNearStation(findNearestStation(latitude,longitude,stations)? findNearestStation(latitude,longitude,stations) : null);
      

      // position yourself in between 2 stations first, then set it as the next station
      const nearestNextStation = findNearestStationIndexToRight(latitude, longitude, stations)
      // setNextStation(nearestNextStation);
      // setCurrentStation(nearestNextStation - 1);
      if(currentStation == null || nextStation == -1){

        setNextStation(nearestNextStation);
        if (nextStation == stations.length - 1){
          setCurrentStation(nearestNextStation);
        }
        else{
          setCurrentStation(nearestNextStation - 1);
        }

      }

      else{
        // pag nakarating na,
        if(haversineDistance(latitude,longitude, stations[nextStation].lat, stations[nextStation].lon) <= 0.1 && arrive==false){
          console.log('ARRIVED');
          

          // ring and vibrate every station
          if (ring == true){
            playDingSound();
          }
          if (vibrate == true){
            Vibration.vibrate(1000)
          }
          
          setNextStation(nearestNextStation);
          if (nextStation == stations.length - 1){
            setCurrentStation(nearestNextStation);
          }
          else{
            setCurrentStation(nearestNextStation - 1);
          }
          setArrive(true);
          scrollToPosition(nextStation !== -1 
            ? ((nextStation - 1) * 250) + (
                ((1 - (haversineDistance(latitude, longitude, stations[nextStation].lat, stations[nextStation].lon) / 
                haversineDistance(stations[nextStation - 1].lat, stations[nextStation - 1].lon, stations[nextStation].lat, stations[nextStation].lon))) * 250) < 1 
                  ? 0 
                  : ((1 - (haversineDistance(latitude, longitude, stations[nextStation].lat, stations[nextStation].lon) / 
                  haversineDistance(stations[nextStation - 1].lat, stations[nextStation - 1].lon, stations[nextStation].lat, stations[nextStation].lon))) * 250) - 100
              ) 
            : 0);

            if(alarmPlayed == false && nextStation != -1 && nextStation == destinationIndex - stationBefore - 1 && haversineDistance(latitude,longitude, stations[nextStation].lat, stations[nextStation].lon) < 0.1){
              if(ring ==true){
                playAlarmSound();
              }
              if(vibrate ==true){
                Vibration.vibrate(1000)
              }
              setAlarmPlayed(true);
            }
          
        
        }
        // pag nakaalis na ulet,
        if(haversineDistance(latitude,longitude, stations[currentStation].lat, stations[currentStation].lon) >= 0.1 && arrive==true){
          console.log('LEFT');
          stopDingSound();
          // setNextStation(nearestNextStation);
          // setCurrentStation(nearestNextStation - 1);
          setArrive(false);
        }


        // LOGS

        console.log('Current station: ' + currentStation);
        console.log('Next station: ' + nextStation);
        console.log('Destination: ' + destinationIndex);
        console.log('Distance: ' + haversineDistance(latitude,longitude, stations[nextStation].lat, stations[nextStation].lon));
        console.log('Arrived: ' + arrive);
      }

    }
    console.log("======================");
  }, [latitude, longitude, stations, nextStation, currentNearStation]);


  // destination changed, refresh
  useEffect(() => {
    refreshVars();
    setAlarmPlayed(false);
  }, [destinationIndex]);
  

  let result;
  if (nextStation == -1) {
    result = 'Welcome to EDSaan';
  }
  else if (arrive == true) {
    result = stations[nextStation].name;
  } else {
    if(haversineDistance(latitude,longitude,stations[currentStation!].lat,stations[currentStation!].lon) <= 0.1){
      result = stations[currentStation!].name
    }
    else{
      result = stations[nextStation].name
    }
  }

  return (
    <View style={styles.main}>
      <View style={styles.header}>
      
        <Text style={styles.paragraph}>{currentNearStation? 'You are now at: ' : 'Next bus stop: ' }</Text>
        <Text style={{fontSize: 30, color: 'black', textAlign: 'center', fontWeight: 'black'}}>{nextStation == -1? 'Welcome to EDSaan': latitude == 0? 'Loading map...' : haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) > 4? 'You are too far from EDSA Busway' : currentNearStation? stations[currentNearStation].name : stations[nextStation].name }</Text>
        <Text style={{textAlign: 'center', fontSize: 15, backgroundColor: '#f0f0f0', padding: 5, borderRadius: 10, margin: 5}}>{latitude == 0? 'Loading map...' : haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) > 4? 'Go near EDSA Carousel Busway or click "Refresh Location"' : arrive==true? destinationIndex==currentStation? '🏁 This is your stop!' : 'Next station: ' + stations[nextStation].name : nextStation != -1 && !currentNearStation? haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon).toFixed(2) + ' KM left' : 'Next station: ' + stations[nextStation].name}</Text>
        <Text style={{textAlign: 'center'}}>{latitude!=0? '': 'Loading Location...'}</Text>
      </View>

      <View style = {{
            backgroundColor: nextStation && destinationIndex > -1 && nextStation != -1 && latitude != 0? nextStation > destinationIndex - stationBefore - 1? '#cf0921' : 'white' : 'white',
            flex: 5,
            justifyContent: 'center',
            borderRadius: 30,
            margin: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center'
      }}>
        {destinationIndex == currentNearStation? <FontAwesome6 name="person-walking" size={20} color="white" /> : destinationIndex < nextStation? <Ionicons name="warning-outline" size={20} color="white" /> : <View></View>}
        <Text style={{
          color: 'white',
          fontSize: 16
        }}>{ destinationIndex == currentNearStation? ' BABA NA PO  ' : destinationIndex < nextStation? ' LAGPAS NA PO  ' : destinationIndex - nextStation + ' station(s) left before destination  '}</Text>
        <TouchableOpacity onPress={() => {setDestinationIndex(-1); stopAlarmSound();}}><Entypo name="circle-with-cross" size={30} color="white" /></TouchableOpacity>

      </View>
             
<View style={styles.mapContainer}>
        <ScrollView horizontal={true} alwaysBounceHorizontal={false} overScrollMode='never' style={{borderRadius: 10}}  ref={scrollViewRef}>
          <ImageBackground source={require('@/assets/images/backdrop.png')} resizeMode = 'repeat' resizeMethod='resize' style={styles.map}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              {stations.map((station, index) => (
              <StationSquare key={index} text={station.name} direction={direction} index = {index}/>))}
            </View>
            <View style={{flexDirection: 'row', marginTop: 40}}>
            {latitude == 0 || haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) > 4? <View></View> : stations.map((station, index) => (
              index == 0? <View key={index}></View> : <Progress.Bar animated={false} progress={index==nextStation? 1 - (haversineDistance(latitude,longitude,stations[nextStation].lat, stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat,stations[nextStation-1].lon,stations[nextStation].lat, stations[nextStation].lon)) : nextStation > index? 1 : 0} width={250} height={5} color={'#FCD20F'} borderColor='#292929' borderWidth={1.2} borderRadius={0} key={index} unfilledColor='gray'/>))}
            {latitude == 0 || haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) > 4? <View></View> : <Progress.Bar progress={0} width={250} height={5} color={'#CF0921'} borderColor='#292929' borderWidth={1.2} borderRadius={0} unfilledColor='gray'/>}
            </View>
            

            {/* nextStation != -1? ((nextStation - 1) * 250) +  ((1 - ((haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) / haversineDistance(stations[nextStation-1].lat, stations[nextStation-1].lon, stations[nextStation].lat, stations[nextStation].lon)))) * 250) : 0, */}
{            latitude == 0 || haversineDistance(latitude,longitude,stations[nextStation].lat,stations[nextStation].lon) > 4? <View></View> : <Image
              style={{
                shadowColor: 'black',
                position: 'absolute',
                marginLeft: nextStation !== -1 
                ? ((nextStation - 1) * 250) + (
                    ((1 - (haversineDistance(latitude, longitude, stations[nextStation].lat, stations[nextStation].lon) / 
                    haversineDistance(stations[nextStation - 1].lat, stations[nextStation - 1].lon, stations[nextStation].lat, stations[nextStation].lon))) * 250) < 1 
                      ? 0 
                      : (1 - (haversineDistance(latitude, longitude, stations[nextStation].lat, stations[nextStation].lon) / 
                      haversineDistance(stations[nextStation - 1].lat, stations[nextStation - 1].lon, stations[nextStation].lat, stations[nextStation].lon))) * 250
                  ) 
                : 0,
                height: 30,
                width: 120,
              }}
              source={require('@/assets/images/bus.png')} resizeMode='contain'/>}
          </ImageBackground>
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: 10, marginHorizontal: 0}}>
          
          <TouchableOpacity style={styles.directionIndicator} onPress={() => {nextStation == -1? null : refreshVars()}}><FontAwesome6 name="location-crosshairs" size={13} color="black" /><Text style={{color: 'black', fontWeight: 'bold', fontSize: 13}}> Refresh Location</Text></TouchableOpacity>
          <View style={styles.directionIndicator}><Text style={{color: 'black', fontSize: 13}}>{direction=='Southbound'? 'To PITX (Southbound) ▶' : 'To Monumento (Northbound) ▶'}</Text></View>
        </View>
        
      </View>
      <View style={styles.footer}>
        <View style={{flex: 80, margin: 10}}>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 30,
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
  },
  notifier: {
    backgroundColor: 'red',
    flex: 10,
    justifyContent: 'center',
    borderRadius: 10

  }
});