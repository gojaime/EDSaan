import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import Entypo from '@expo/vector-icons/Entypo';
import { useGlobalState } from "../context/GlobalContext";

type StationSquareProps = {
  text: string;
  direction: string|string[];
  index: number;
};

const StationSquare: React.FC<StationSquareProps> = ({ text, direction, index }) => {
  const router = useRouter();

  const { destinationIndex, setDestinationIndex, setDirection } = useGlobalState();

  return (
    <TouchableOpacity onPress={() => {
      if (destinationIndex != -1){
        router.push({ pathname: "/stationScreen", params: { post: text, direction: direction, newIndex: index} });
      }
      else{
        router.push({ pathname: "/explore", params: { post: ""} });
      }
    }}>
      <View style={{
            backgroundColor: index == destinationIndex?  'white' : '#0038A8',
            width: 125,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 125,
            borderRadius: 10,
            zIndex: 1,
            shadowColor: 'black',
            elevation: 50,
            flexDirection: 'row'
      }}>
        <Text style={{color: index == destinationIndex?  'black' : 'white', textAlign: 'center', fontWeight: 'bold'}}>{index == destinationIndex? <Entypo name="flag" size={13} color="red" /> : <FontAwesome name="map-pin" size={13} color="red" />}{' ' + text}</Text>
      </View>
      <View style={{
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 30,
            borderTopWidth: 30,
            borderRightColor: "transparent",
            borderTopColor: index == destinationIndex?  'white' : '#0038A8',
            marginTop: -10,
            zIndex: 0
      }}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#0038A8',
    width: 125,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 125,
    borderRadius: 10,
    zIndex: 1,
    shadowColor: 'black',
    elevation: 50,
    flexDirection: 'row'
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 30,
    borderTopWidth: 30,
    borderRightColor: "transparent",
    borderTopColor: "#0038A8",
    marginTop: -10,
    zIndex: 0
  },
});

export default StationSquare;
