import React from 'react';
import { Image, ScrollView, Text, StyleSheet } from 'react-native';

const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
};

const logo1 = {
    uri: 'https://static.insales-cdn.com/images/products/1/6576/590510512/%D0%A1%D0%BC%D0%B0%D1%80%D1%82%D1%84%D0%BE%D0%BD_Apple_iPhone_14_Blue_%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C_%D0%B2_%D0%9F%D0%B5%D1%80%D0%BC%D0%B8.jpeg'
}

const logo2 = {
    uri: 'https://www.shutterstock.com/image-vector/blue-horizontal-lens-flares-pack-260nw-2202148279.jpg'
}

export default function ImageList({ images1 }) {
    const images = [
        logo,
        logo,
        logo1,
        logo2,
        logo1
    ]
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