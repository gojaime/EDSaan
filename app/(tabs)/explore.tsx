import React, { useState } from 'react';
import { View, useWindowDimensions, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';


const sbstations = [
  { name: 'Monumento', lat: 100, lon: 200 },
  { name: 'Bagong Barrio', lat: 100, lon: 300 },
  { name: 'Balintawak', lat: 100, lon: 400 },
  { name: 'Kaingin Road', lat: 100, lon: 400 },
  { name: 'LRT 1- Roosevelt Station', lat: 100, lon: 400 },
  { name: 'MRT 3 North Avenue', lat: 100, lon: 400 },
  { name: 'MRT 3 Quezon Avenue', lat: 100, lon: 400 },
  { name: 'Nepa Q-Mart', lat: 100, lon: 400 },
  { name: 'Main Ave (Cubao)', lat: 100, lon: 400 },
  { name: 'MRT 3 Santolan Station', lat: 100, lon: 400 },
  { name: 'MRT 3 Ortigas Station', lat: 100, lon: 400 },
  { name: 'Guadalupe Bridge', lat: 100, lon: 400 },
  { name: 'MRT 3 Buendia Station', lat: 100, lon: 400 },
  { name: 'MRT 3 Ayala Station (curbside)', lat: 100, lon: 400 },
  { name: 'Taft Avenue', lat: 100, lon: 400 },
  { name: 'Roxas Boulevard', lat: 100, lon: 400 },
  { name: 'SM Mall of Asia (curbside)', lat: 100, lon: 400 },
  { name: 'Macapagal - DFA (curbside)', lat: 100, lon: 400 },
  { name: 'Macapagal - City of Dreams (curbside)', lat: 100, lon: 400 },
  { name: 'PITX', lat: 100, lon: 400 },
];

const nbstations = [
  { name: 'PITX', lat: 100, lon: 200 },
  { name: 'Macapagal - City of Dreams (curbside)', lat: 100, lon: 300 },
  { name: 'Macapagal - DFA (curbside)', lat: 100, lon: 400 },
  { name: 'Roxas Boulevard', lat: 100, lon: 400 },
  { name: 'Taft Avenue', lat: 100, lon: 400 },
  { name: 'MRT 3 Ayala Station (curbside)', lat: 100, lon: 400 },
  { name: 'MRT 3 Buendia Station', lat: 100, lon: 400 },
  { name: 'Guadalupe Bridge', lat: 100, lon: 400 },
  { name: 'MRT 3 Ortigas Station', lat: 100, lon: 400 },
  { name: 'MRT 3 Santolan Station', lat: 100, lon: 400 },
  { name: 'Main Ave (Cubao)', lat: 100, lon: 400 },
  { name: 'Nepa Q-Mart', lat: 100, lon: 400 },
  { name: 'MRT 3 Quezon Avenue Station', lat: 100, lon: 400 },
  { name: 'MRT 3 North Avenue', lat: 100, lon: 400 },
  { name: 'LRT-1 Roosevelt Station', lat: 100, lon: 400 },
  { name: 'Kaingin Road', lat: 100, lon: 400 },
  { name: 'Balintawak', lat: 100, lon: 400 },
  { name: 'Bagong Barrio', lat: 100, lon: 400 },
  { name: 'Monumento', lat: 100, lon: 400 }
];

const MyTabView = () => {
  const router = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: '↑ Northbound' },
    { key: 'second', title: '↓ Southbound' },
  ]);

  // Define your screens
  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={nbstations}
        keyExtractor={(item, index) => index.toString()} // Maintain original indexing
        renderItem={({ item, index }) =>
          index === 0 ? <View style={{ height: 0, opacity: 0 }} /> : ( // Hide the first item
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                router.push({
                  pathname: "/stationScreen",
                  params: { post: item.name, direction: 'Northbound'},
                });
              }}
            >
              <FontAwesome name="map-pin" size={13} color="red" />
              <Text style={styles.text}>{'  '}{item.name}</Text>
            </TouchableOpacity>
          )
        }
      />

    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={sbstations}
        keyExtractor={(item, index) => index.toString()} // Maintain original indexing
        renderItem={({ item, index }) =>
          index === 0 ? <View style={{ height: 0, opacity: 0 }} /> : ( // Hide the first item
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                router.push({
                  pathname: "/stationScreen",
                  params: { post: item.name, direction: 'Southbound', newIndex: index },
                });
              }}
            >
              <FontAwesome name="map-pin" size={13} color="red" />
              <Text style={styles.text}>{'  '}{item.name}</Text>
            </TouchableOpacity>
          )
        }
      />

    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{flex: 25, justifyContent: 'center'}}>
        <Text style={{textAlign: 'center', fontSize: 23}}>Choose your direction and destination:</Text>
      </View>
      <TabView
        style={{flex: 75}}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#ffffff' }} // White tab bar background
            activeColor="#000000" // Black text for active tab
            inactiveColor="#666666" // Gray text for inactive tabs
            indicatorStyle={{ backgroundColor: '#0035AA', height: 3 }} // Blue underline (active tab)
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MyTabView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    padding: 10,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: 10,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: '#000000', // Black text
    fontWeight: 'bold',
  },
});

