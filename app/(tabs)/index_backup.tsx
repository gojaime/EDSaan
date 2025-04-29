import { Image, StyleSheet, View, Text, SafeAreaView,TouchableOpacity, Linking, Vibration } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalState } from "../../context/GlobalContext";

export default function HomeScreen() {

    const { ring,
            setRing,
            vibrate,
            setVibrate,
            stationBefore,
            setStationBefore,
            alarmPlayed,
            setAlarmPlayed
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
        <View style={{                        padding: 15,
                        marginVertical: 5,
                        backgroundColor: '#f0f0f0', // Light gray background
                        borderRadius: 10,
                        margin: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly'}}>

          <View style={{flexDirection: 'row'}}>
            <Text style={{marginLeft: 10}}>Alert</Text><Text style={{fontWeight: 'bold'}}> {stationBefore} </Text><Text>station(s) before destination </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
              setStationBefore(stationBefore == 0? stationBefore : stationBefore - 1);
              setAlarmPlayed(false);
              
            }}><AntDesign name="minuscircleo" size={24} color="black" /></TouchableOpacity>

            <TouchableOpacity style={{marginLeft: 5}} onPress={() => {
              setStationBefore(stationBefore == 3? stationBefore : stationBefore + 1);
              setAlarmPlayed(false);
              
            }}><AntDesign name="pluscircleo" size={24} color="black" /></TouchableOpacity>
          </View>

        </View>
        <TouchableOpacity style={{
                        padding: 15,
                        marginVertical: 5,
                        backgroundColor: vibrate == true?  '#fcd20f' : '#f0f0f0', // Light gray background
                        borderRadius: 10,
                        margin: 20,
                        flexDirection: 'row',
                        alignItems: 'center'
        }}
          onPress={() => {
              vibrate == false? Vibration.vibrate(1000) : null;
              vibrate == true? setVibrate(false) : setVibrate(true);
              
            }}>
              <MaterialCommunityIcons name="vibrate" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Vibrate: {vibrate == true? 'On': 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: ring == true?  '#fcd20f' : '#f0f0f0',
              borderRadius: 10,
              margin: 20,
              flexDirection: 'row',
              alignItems: 'center'
        }}
          onPress={() => {
            ring == true? setRing(false) : setRing(true)
          }}
        >
              <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Ring: {ring == true? 'On': 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: '#f0f0f0', // Light gray background
              borderRadius: 10,
              margin: 20,
              flexDirection: 'row',
              alignItems: 'center'
        }} onPress={handlePress}>
              <MaterialIcons name="feedback" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Help my research by giving feedback!</Text>
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
