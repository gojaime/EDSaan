import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Link, useRouter } from 'expo-router';

type StationSquareProps = {
  text: string;
};

const StationSquare: React.FC<StationSquareProps> = ({ text }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => {router.push({ pathname: "/stationScreen", params: { post: text} });}}>
      <View style={styles.box}>
        <Text style={{color: 'white', textAlign: 'center'}}>📍 {text}</Text>
      </View>
      <View style={styles.triangleCorner}></View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#0038A8',
    width: 125,
    height: 'auto',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 125,
    borderRadius: 10,
    zIndex: 1,
    shadowColor: 'black',
    elevation: 50
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
