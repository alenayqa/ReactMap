import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { Button } from 'react-native-web';
import { Text } from 'react-native-web';

const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
};


export default function MapScreen({ route, navigation }) {
    const images = [
        logo,
    ]
    //   const markers = [{
    //     latitude: 58.01,
    //     longitude: 56.2,
    //   },
    //   {
    //     latitude: 58.017,
    //     longitude: 56.22,
    //   }];

    const [markers, setMarkers] = useState([]);
    // let db = route.params.db;

    useEffect(() => {
        global.db.transaction((tx) => {
            tx.executeSql("SELECT * FROM marker;", [], (_, rows) =>
                setMarkers(rows.rows._array)
            );
        });
    });

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
                    latitude: 58.01,
                    longitude: 56.2,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
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