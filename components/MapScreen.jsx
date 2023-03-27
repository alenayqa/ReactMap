import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';

export default function MapScreen({ route, navigation }) {
    //   const markers = [{
    //     latitude: 58.01,
    //     longitude: 56.2,
    //   },
    //   {
    //     latitude: 58.017,
    //     longitude: 56.22,
    //   }];

    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (route.params?.post) {
            alert(route.params?.post)
        }
    }, [route.params?.post]);

    const onMapPressed = (e) => {
        const coordsPressed = e.nativeEvent.coordinate;
        const marker = {
            latitude: coordsPressed.latitude,
            longitude: coordsPressed.longitude,
            key: 5,
        }
        setMarkers(markers => [...markers, marker])
    }

    const onMarkerPressed = (e, marker) => {
        const coordsPressed = e.nativeEvent.coordinate;
        // alert(JSON.stringify(coordsPressed))
        navigation.navigate("Marker", {
            coordinate: coordsPressed,
            marker: marker
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