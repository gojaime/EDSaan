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

  const sbstations = [
    // { name: 'Blumentritt', lat: 14.622729182722175, lon: 120.98285569880103 },
    // { name: 'Tayuman', lat: 14.616824988491773, lon: 120.98277949972521 },
    // { name: 'Bambang', lat: 14.611344590078984, lon: 120.98248220070431 },
    // { name: 'Doroteo Jose', lat: 14.60540182254872, lon: 120.98204152713323 },
    // { name: 'Carriedo', lat: 14.599110558358499, lon: 120.98133498889699 }

    { name: 'Monumento', lat: 14.657219029117009, lon: 120.98624038939495, id: 'monumento' },
    { name: 'Bagong Barrio', lat: 14.657485937483145, lon: 120.99806064378366, id: 'bagongbarrio' },
    { name: 'Balintawak', lat: 14.65755519840395, lon: 121.00479165527882, id: 'balintawak' },
    { name: 'Kaingin Road', lat: 14.657721472300674, lon: 121.01152980733613, id: 'kainginroad' },
    { name: 'LRT 1- Roosevelt Station', lat: 14.65778465621674, lon: 121.0196870764625, id: 'roosevelt' },
    { name: 'SM North EDSA', lat: 14.655957259707604, lon: 121.02854235896207, id: 'smnorth' },
    { name: 'MRT 3 North Avenue', lat: 14.651448496391131, lon: 121.03285691836994, id: 'northave' },
    { name: 'Philam QC', lat: 14.647751137163727, lon: 121.03519650998638, id: 'philam' },
    { name: 'MRT 3 Quezon Avenue', lat: 14.641667514884944, lon: 121.03926668810226, id: 'quezonave' },
    { name: 'Nepa Q-Mart', lat: 14.629176468642413, lon: 121.04670279166625, id: 'qmart' },
    { name: 'Main Ave (Cubao)', lat: 14.614308409451436, lon: 121.05352753530148, id: 'cubao' },
    { name: 'MRT 3 Santolan Station', lat: 14.60930543443652, lon: 121.05582512841691, id: 'santolan' },
    { name: 'MRT 3 Ortigas Station', lat: 14.587185735799936, lon: 121.05637772583611, id: 'ortigas' },
    { name: 'Guadalupe Bridge', lat: 14.568242797479215, lon: 121.04588947554471, id: 'guadalupe' },
    { name: 'MRT 3 Buendia Station', lat: 14.55523904597124, lon: 121.03484401950507, id: 'buendia' },
    { name: 'MRT 3 Ayala Station (curbside)', lat: 14.548725551548406, lon: 121.02717510650163, id: 'ayala' },
    { name: 'Tramo', lat: 14.537919674492098, lon: 121.00339234219761, id: 'tramo' },
    { name: 'Taft Avenue', lat: 14.537643850518256, lon: 120.99965756701496, id: 'taft' },
    { name: 'Roxas Boulevard', lat: 14.537115199032753, lon: 120.99219828125118, id: 'roxasboulevard' },
    { name: 'SM Mall of Asia (curbside)', lat: 14.535488641704239, lon: 120.98335223324048, id: 'moa' },
    { name: 'Macapagal - DFA (curbside)', lat: 14.529755974112643, lon: 120.98969071861411, id: 'dfa' },
    { name: 'Macapagal - City of Dreams (curbside)', lat: 14.523843181672278, lon: 120.9903610225918, id: 'cityofdreams' },
    { name: 'PITX', lat: 14.5101848399529, lon: 120.99124717358177, id: 'pitx' },
  ];
  
  const nbstations = [
    { name: 'PITX', lat: 14.5101848399529, lon: 120.99124717358177, id: 'pitx' },
    { name: 'Macapagal - City of Dreams (curbside)', lat: 14.523843181735627, lon: 120.99056487037772, id: 'cityofdreams' },
    { name: 'Macapagal - DFA (curbside)', lat: 100, lon: 400, id: 'dfa' },
    { name: 'Roxas Boulevard', lat: 14.537115199032753, lon: 120.99219828125118, id: 'roxasboulevard' },
    { name: 'Taft Avenue', lat: 14.537643850518256, lon: 120.99965756701496, id: 'taft' },
    { name: 'MRT 3 Ayala Station (curbside)', lat: 14.549874376781167, lon: 121.02842938817616, id: 'ayala' },
    { name: 'MRT 3 Buendia Station', lat: 14.55523904597124, lon: 121.03484401950507, id: 'buendia' },
    { name: 'Guadalupe Bridge', lat: 14.568242797479215, lon: 121.04588947554471, id: 'guadalupe' },
    { name: 'MRT 3 Ortigas Station', lat: 14.587185735799936, lon: 121.05637772583611, id: 'ortigas' },
    { name: 'MRT 3 Santolan Station', lat: 14.60930543443652, lon: 121.05582512841691, id: 'santolan' },
    { name: 'Main Ave (Cubao)', lat: 14.614308409451436, lon: 121.05352753530148, id: 'cubao' },
    { name: 'Nepa Q-Mart', lat: 14.629176468642413, lon: 121.04670279166625, id: 'qmart' },
    { name: 'MRT 3 Quezon Avenue Station', lat: 14.641667514884944, lon: 121.03926668810226, id: 'quezonave' },
    { name: 'Philam QC', lat: 14.647751137163727, lon: 121.03519650998638, id: 'philam' },
    { name: 'MRT 3 North Avenue', lat: 14.651448496391131, lon: 121.03285691836994, id: 'northave' },
    { name: 'SM North EDSA', lat: 14.655957259707604, lon: 121.02854235896207, id: 'smnorth' },
    { name: 'LRT-1 Roosevelt Station', lat: 14.65778465621674, lon: 121.0196870764625, id: 'roosevelt' },
    { name: 'Kaingin Road', lat: 14.657721472300674, lon: 121.01152980733613, id: 'kainginroad' },
    { name: 'Balintawak', lat: 14.65755519840395, lon: 121.00479165527882, id: 'balintawak' },
    { name: 'Bagong Barrio', lat: 14.657485937483145, lon: 120.99806064378366, id: 'bagongbarrio' },
    { name: 'Monumento', lat: 14.657219029117009, lon: 120.98624038939495, id: 'monumento' }

    // { name: 'Carriedo', lat: 14.599110558358499, lon: 120.98133498889699 },
    // { name: 'Doroteo Jose', lat: 14.60540182254872, lon: 120.98204152713323 },
    // { name: 'Bambang', lat: 14.611344590078984, lon: 120.98248220070431 },
    // { name: 'Tayuman', lat: 14.616824988491773, lon: 120.98277949972521 },
    // { name: 'Blumentritt', lat: 14.622729182722175, lon: 120.98285569880103 },


  ];

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
