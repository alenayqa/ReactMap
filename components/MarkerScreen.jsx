import React from 'react';
import { Text, TextInput, Button } from 'react-native'
import { useEffect } from 'react';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ImageList from './ImagesList';


export default function MarkerScreen({ route, navigation }) {
    const [postText, setPostText] = React.useState('');
    const [images, setImages] = useState([]);
    const { marker } = route.params;
    console.log(marker.index)
    useEffect(() => {
        if (images.length == 0) {
            setImages([...marker.images]);
        }
    })

    const addImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImages([...images, { uri: result.assets[0].uri }])
        } else {
            alert("fail");
        }
    }

    return (
        <>
            <ImageList images={images} />
            <Button
                title="Добавить фото"
                onPress={addImageAsync}
            />
            <Button
                title="Сохранить и выйти"
                onPress={() => {
                    // Pass and merge params back to home screen
                    navigation.navigate({
                        name: 'Home',
                        params: { images: images, index: marker.index },
                        merge: true,
                    });
                }}
            />
        </>
    );
}