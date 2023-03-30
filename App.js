import React from 'react';
import { useEffect } from 'react';
import MapScreen from './components/MapScreen';
import MarkerScreen from './components/MarkerScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from "expo-sqlite";
import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
const Stack = createNativeStackNavigator();

global.db = SQLite.openDatabase("reactmaps88.db");

export default function App() {
  useEffect(() => {
    global.db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS marker (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude REAL, longitude REAL);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS image (id INTEGER PRIMARY KEY AUTOINCREMENT, marker_id INTEGER REFERENCES marker(id), uri TEXT);"
      );
    })
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={MapScreen}/>
        <Stack.Screen name="Marker" component={MarkerScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}