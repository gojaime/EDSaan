import { Image, StyleSheet, Platform, View, Text, SafeAreaView,TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{flex: 30, justifyContent: 'center', marginTop: 20}}>
        <Text style={{textAlign: 'center', fontSize: 40}}>EDSaan</Text>
        <Text style={{textAlign: 'center', fontSize: 14}}>Created by George O. Jaime III</Text>
      </View>
      <View style={{flex: 50, justifyContent: 'flex-end'}}>
        <TouchableOpacity style={styles.item}>
              <MaterialCommunityIcons name="vibrate" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Vibrate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
              <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
              <Text style={{marginLeft: 10}}>Ring</Text>
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
