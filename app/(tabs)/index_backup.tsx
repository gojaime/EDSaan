import { Image, StyleSheet, View, Text, SafeAreaView,TouchableOpacity, Linking } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalState } from "../../context/GlobalContext";

export default function HomeScreen() {

    const { ring,
            setRing,
            vibrate,
            setVibrate
          } = useGlobalState();

  const handlePress = () => {
    const url = 'https://docs.google.com/forms/d/e/1FAIpQLSchkB1glFfvVt4609WCbUgx5MV-KUfLPy4SrPLyVoNbNsJAeQ/viewform?usp=dialog';
    Linking.openURL(url).catch(err =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{flex: 40, justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>
        <Image source={require('@/assets/images/EDSAan-cropped.png')} style={{width: 200, height: 100}} resizeMode='contain'></Image>
        <Text style={{textAlign: 'center', fontSize: 14}}></Text>
      </View>
      <View style={{flex: 30, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Created by George O. Jaime III</Text>
        <Text>In fulfillment of requirements for CMSC 190</Text>
        <Text>University of the Philippines Los Baños</Text>
      </View>
      <View style={{flex: 30, justifyContent: 'flex-end'}}>
        <TouchableOpacity style={styles.item}
          onPress={() => {
              vibrate == true? setVibrate(false) : setVibrate(true)
            }}>
              <MaterialCommunityIcons name="vibrate" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Vibrate: {vibrate == true? 'On': 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}
          onPress={() => {
            ring == true? setRing(false) : setRing(true)
          }}
        >
              <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Ring: {ring == true? 'On': 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handlePress}>
              <MaterialIcons name="feedback" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Give your feedback! {' (help my research)'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
});
