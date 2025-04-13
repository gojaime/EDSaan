import React, { useState, useCallback } from 'react';
import { View, useWindowDimensions, FlatList, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useGlobalState } from '../../context/GlobalContext';
import type { TabBarProps } from 'react-native-tab-view';

const MyTabView = () => {
  const router = useRouter();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: '↑ Northbound' },
    { key: 'second', title: '↓ Southbound' },
  ]);

  const {
    destinationIndex, setDestinationIndex,
    direction, setDirection,
    nextStation, setNextStation,
    latitude, longitude,
    sbstations, nbstations
  } = useGlobalState();

  const FirstRoute = () => (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>To Monumento</Text>
      <FlatList
        style={{ borderRadius: 10, marginHorizontal: 20 }}
        data={nbstations}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) =>
          index === 0 ? <View style={{ height: 0, opacity: 0 }} /> : (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                router.push({
                  pathname: "/stationScreen",
                  params: { post: item.name, direction: 'Northbound', newIndex: index },
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
      <Text style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>To PITX</Text>
      <FlatList
        style={{ borderRadius: 10, marginHorizontal: 20 }}
        data={sbstations}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) =>
          index === 0 ? <View style={{ height: 0, opacity: 0 }} /> : (
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

  const renderTabBar = useCallback((props: TabBarProps<any>) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        marginHorizontal: 10,
        borderRadius: 10,
        overflow: 'hidden'
      }}
      activeColor="#000000"
      inactiveColor="#666666"
      indicatorStyle={{
        backgroundColor: '#fed21d',
        height: '100%',
        borderRadius: 10,
      }}
    />
  ), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{ flex: 25, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('@/assets/images/EDSAan-cropped.png')}
          style={{ width: 100, height: 50, margin: 20 }}
          resizeMode='contain'
        />
        <Text style={{ textAlign: 'center', fontSize: 18 }}>Choose your direction and destination:</Text>
      </View>

      <TabView
        style={{ flex: 75 }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

export default MyTabView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});
