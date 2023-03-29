import React from 'react';
import { Image, ScrollView, Text, StyleSheet } from 'react-native';

export default function ImageList({ images }) {
    const imagesDisplayed = images.map((image, index) => {
        return (
            <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.image}
            />)
    })
    return (
        <ScrollView>
            {imagesDisplayed}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '90%',
        aspectRatio: 1,
        alignSelf: 'center',
        margin: 10,
    },
});