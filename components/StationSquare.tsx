import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';

type StationSquareProps = {
  text: string;
  direction: string|string[];
};

const StationSquare: React.FC<StationSquareProps> = ({ text, direction }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => {
      if (direction){
        router.push({ pathname: "/stationScreen", params: { post: text, direction: direction} });
      }
      else{
        router.push({ pathname: "/explore", params: { post: ""} });
      }
    }}>
      <View style={styles.box}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}><FontAwesome name="map-pin" size={13} color="red" />{' ' + text}</Text>
      </View>
      <View style={styles.triangleCorner}></View>
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
