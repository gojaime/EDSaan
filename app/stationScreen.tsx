import { StyleSheet, Image, Platform, View,Text, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocalSearchParams, Link, useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { setParams } from 'expo-router/build/global-state/routing';
import { useGlobalState } from "../context/GlobalContext";

export default function TabTwoScreen() {
  const { post, newIndex, direction } = useLocalSearchParams();
  const {  } = useLocalSearchParams();
  const router = useRouter();

  const { destinationIndex, setDestinationIndex, setDirection, setNextStation, nextStation, latitude,longitude,sbstations,nbstations,currentStation, stationsDesc } = useGlobalState();

  const newIndexParsed = Number(newIndex);

  const stations = direction === "Southbound" ? sbstations : nbstations;

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
  
  const nextSB = findNearestStationIndexToRight(latitude,longitude,sbstations);
  const nextNB = findNearestStationIndexToRight(latitude,longitude,nbstations);

  var nextIndex;
  if (direction=='Southbound'){
    nextIndex = nextSB;
    console.log("sb");
  }
  else{
    nextIndex = nextNB;
    console.log("nb");
  }

  const stationImages: Record<string, any> = {
    monumento: require('@/assets/images/stations/monumento.jpg'),
    bagongbarrio: require('@/assets/images/stations/bagongbarrio.jpg'),
    balintawak: require('@/assets/images/stations/balintawak.jpg'),
    kainginroad: require('@/assets/images/stations/kainginroad.jpg'),
    roosevelt: require('@/assets/images/stations/roosevelt.jpg'),
    smnorth: require('@/assets/images/stations/smnorth.jpg'),
    northave: require('@/assets/images/stations/northave.jpg'),
    quezonave: require('@/assets/images/stations/quezonave.jpg'),
    qmart: require('@/assets/images/stations/qmart.jpg'),
    cubao: require('@/assets/images/stations/cubao.jpg'),
    santolan: require('@/assets/images/stations/santolan.jpg'),
    ortigas: require('@/assets/images/stations/ortigas.jpg'),
    guadalupe: require('@/assets/images/stations/guadalupe.jpg'),
    buendia: require('@/assets/images/stations/buendia.jpg'),
    ayala: require('@/assets/images/stations/ayala.jpg'),
    tramo: require('@/assets/images/stations/tramo.jpg'),
    taft: require('@/assets/images/stations/taft.jpg'),
    roxasboulevard: require('@/assets/images/stations/roxasboulevard.jpg'),
    moa: require('@/assets/images/stations/moa.jpg'),
    dfa: require('@/assets/images/stations/dfa.jpg'),
    cityofdreams: require('@/assets/images/stations/cityofdreams.jpg'),
    pitx: require('@/assets/images/stations/pitx.jpg'),
  };
  

  const station = stationsDesc.find(station => station.id === stations[newIndexParsed].id);
  const stationimage = stationImages[station!.id];


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#D0D0D0' }}
      headerImage={
        <Image
        source={stationimage}
        style={styles.headerImage}
        resizeMode='stretch'
      />
      }>
      <View style={{backgroundColor: 'white'}}>
        <ThemedText type="title" darkColor='dark'>{stations[newIndexParsed].name}</ThemedText>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10}}>
          {<TouchableOpacity
            style={{
              backgroundColor: '#0038A8',
              borderRadius: 10,
              padding: 5,
              marginRight: 10,
              flex: 75,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexDirection: 'row'
              }}
              onPress={() => {
                setDirection(direction.toString());
                setDestinationIndex(newIndexParsed);
                // setNextStation(findNearestStationIndexToRight(latitude,longitude,stations));
                router.replace({pathname: '/'});
                }}>
              <Text style={{color: 'white', fontSize: 14, flex: 75, textAlign: 'center'}}>{'Set as Destination (' + direction + ')'}</Text><Ionicons name="send" size={20} color="white" style={{flex: 25}}/>
            </TouchableOpacity>}
          <TouchableOpacity style={{backgroundColor: '#fcd20f', borderRadius: 10, padding: 5, flex: 25, justifyContent: 'center', alignItems: 'center'}}><Entypo name="map" size={24} color="black" /></TouchableOpacity>
        </View>

      {station?         <View>
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 10 }}>Description</Text>
      {station!.intro.map((line, index) => (
        <Text key={index} style={{ marginLeft: 10, marginTop: 2 }}>{`\u2022 ${line}`}</Text>
      ))}

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 10 }}>Dining Options Nearby</Text>
      {station!.food.map((item, index) => (
        <Text key={index} style={{ marginLeft: 10, marginTop: 2 }}>{`\u2022 ${item}`}</Text>
      ))}

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 10 }}>Places to Visit</Text>
      {station!.places.map((place, index) => (
        <Text key={index} style={{ marginLeft: 10, marginTop: 2 }}>{`\u2022 ${place}`}</Text>
      ))}

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 10 }}>Accommodation</Text>
      {station!.accommodation.map((acc, index) => (
        <Text key={index} style={{ marginLeft: 10, marginTop: 2 }}>{`\u2022 ${acc}`}</Text>
      ))}
        </View> : <Text style={{margin: 10}}>No available description yet</Text>}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
