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

  const { destinationIndex, setDestinationIndex, setDirection } = useGlobalState();

  const newIndexParsed = Number(newIndex);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#D0D0D0' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <View style={{backgroundColor: 'white'}}>
        <ThemedText type="title" darkColor='dark'>{post}</ThemedText>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10}}>
          <TouchableOpacity style={{backgroundColor: '#0038A8', borderRadius: 10, padding: 5, marginRight: 10, flex: 75, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}} onPress={() => {router.replace({pathname: '/'}); setDirection(direction.toString()); setDestinationIndex(newIndexParsed) }}><Text style={{color: 'white', fontSize: 14, flex: 75, textAlign: 'center'}}>{'Set as Destination (' + direction + ')'}</Text><Ionicons name="send" size={20} color="white" style={{flex: 25}}/></TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#fcd20f', borderRadius: 10, padding: 5, flex: 25, justifyContent: 'center', alignItems: 'center'}}><Entypo name="map" size={24} color="black" /></TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
