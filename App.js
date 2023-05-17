import React from 'react';
import { useEffect, useState } from 'react';
import MapScreen from './components/MapScreen';
import MarkerScreen from './components/MarkerScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from "expo-sqlite";
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

import { LogBox } from 'react-native';
// LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
const Stack = createNativeStackNavigator();

global.db = SQLite.openDatabase("reactmaps29.db");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


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
        <Stack.Screen name="Home" component={MapScreen} />
        <Stack.Screen name="Marker" component={MarkerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}