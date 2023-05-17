import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { Button } from 'react-native-web';
import { Text } from 'react-native-web';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager"


const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
};

// const LOCATION_TASK_NAME = 'background-location-task';

// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//     if (error) {
//       console.error(error)
//       return
//     }
//     if (data) {
//       // Extract location coordinates from data
//       const { locations } = data
//       const location = locations[0]
//       if (location) {
//         console.log("Location in background", location.coords)
//       }
//     }
//   })


export default function MapScreen({ route, navigation }) {

    const distance = (lat1, lon1, lat2, lon2) => {
        let R = 6378.137;
        let dLat = lat2 * 3.14 / 180 - lat1 * 3.14 / 180;
        let dLon = lon2 * 3.14 / 180 - lon1 * 3.14 / 180;
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * 3.14 / 180) * Math.cos(lat2 * 3.14 / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d * 1000; // meters
    }

    const isClose = (lat1, lon1, lat2, lon2) => {
        return distance(lat1, lon1, lat2, lon2) < 100;
    }

    const images = [
        logo,
    ]

    const [markers, setMarkers] = useState([]);
    const [position, setPosition] = useState(null);
    const [notifications, setNotifications] = useState({})

    const startBackgroundUpdate = async () => {

        // Make sure the task is defined otherwise do not start tracking
        const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
        if (!isTaskDefined) {
            console.log("Task is not defined")
            return
        }

        // Don't track if it is already running in background
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TASK_NAME
        )
        if (hasStarted) {
            console.log("Already started")
            return
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
            //   distanceInterval: 0.05,
            // Make sure to enable this notification if you want to consistently track in the background
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Location",
                notificationBody: "Location tracking in background",
                notificationColor: "#fff",
            },
        })
    }

    useEffect(() => {
        // const requestPermissions = async () => {
        //     const foreground = await Location.requestForegroundPermissionsAsync()
        //     if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
        //   }
        // requestPermissions()
        // startBackgroundUpdate();
        global.db.transaction((tx) => {
            tx.executeSql("SELECT * FROM marker;", [], (_, rows) =>
                setMarkers(rows.rows._array)
            );
        });

        const watchPosition = (async () => {
            let locations = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 0.5
                // timeInterval: 100,
            }, (loc) => setPosition(loc.coords));//processLocation(loc.coords)); //setPosition(position.coords));
        });

        const getPermissions = (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        })
        getPermissions();
        watchPosition();
    }, []);

    useEffect(() => {
        if (position !== null) {
            processLocation(position);
        }
    }, [position])

    const showNotification = async () => {
        let location = await Location.getCurrentPositionAsync({});
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'ReactMap',
                body: "I'm so proud of myself!",
            },
            trigger: null,
        });
        // console.log(location)
    }

    const processLocation = async (loc) => {
        console.log(loc)
        // Notifications.dismissAllNotificationsAsync();
        for (const marker of markers) {
            if (isClose(marker.latitude, marker.longitude, loc.latitude, loc.longitude)) {
                if (notifications[marker.id] === undefined) {
                    notifications[marker.id] = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Приближаемся к точке:",
                            body: JSON.stringify(marker.id),
                        },
                        trigger: null,
                    });
                    setNotifications(notifications);
                }
            }
            else {
                if (notifications[marker.id] !== undefined) {
                    await Notifications.dismissNotificationAsync(notifications[marker.id]);
                    delete notifications[marker.id];
                    setNotifications(notifications);
                }
            }
        }
    }

    //   const markers = [{
    //     latitude: 58.01,
    //     longitude: 56.2,
    //   },
    //   {
    //     latitude: 58.017,
    //     longitude: 56.22,
    //   }];

    // let db = route.params.db;





    const onMapPressed = (e) => {
        const coordsPressed = e.nativeEvent.coordinate;
        global.db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO marker (latitude, longitude) VALUES (?, ?);",
                [coordsPressed.latitude, coordsPressed.longitude],
                (_, rows) =>
                    setMarkers([...markers, {
                        id: rows.insertId,
                        latitude: coordsPressed.latitude,
                        longitude: coordsPressed.longitude,
                    }])
            )
        })
    }

    const onMarkerPressed = (e, marker) => {
        const coordsPressed = e.nativeEvent.coordinate;
        navigation.navigate("Marker", {
            coordinate: coordsPressed,
            marker_id: marker.id,
        });
    }

    const markersDisplayed = markers.map((marker, index) => {
        return (
            <Marker
                key={index}
                coordinate={marker}
                title={index.toString()}
                onPress={e => onMarkerPressed(e, marker)}
            />)
    })

    return (
        <View style={styles.container}>
            <MapView style={styles.map}
                initialRegion={{
                    latitude: 57.976702294586886,
                    longitude: 56.10351269650697,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                }}
                showsUserLocation={true}
                onPress={onMapPressed}>
                {markersDisplayed}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});