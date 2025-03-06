import React from "react";
import {View, Text, StyleSheet} from 'react-native';
type StationSquareProps = {
  text: string;
};

const StationSquare: React.FC<StationSquareProps> = ({ text }) => {
  return (
    <View>
      <View style={styles.box}>
        <Text style={{color: 'white', textAlign: 'center'}}>📍 {text}</Text>
      </View>
      <View style={styles.triangleCorner}></View>
    </View>
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
