import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';

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

    useEffect(() => {
        if (route.params?.images) {
            let new_markers = [...markers];
            new_markers[route.params.index] = {
                latitude: markers[route.params.index].latitude,
                longitude: markers[route.params.index].longitude,
                images: route.params.images,
                index: route.params.index,
            }
            setMarkers(new_markers)
        }
    }, [route.params?.images]);

    const onMapPressed = (e) => {
        const coordsPressed = e.nativeEvent.coordinate;
        const marker = {
            latitude: coordsPressed.latitude,
            longitude: coordsPressed.longitude,
            images: [...images],
            index: markers.length,
        }
        setMarkers(markers => [...markers, marker])
    }

    const onMarkerPressed = (e, marker) => {
        const coordsPressed = e.nativeEvent.coordinate;
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