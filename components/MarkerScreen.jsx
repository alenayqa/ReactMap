import React from 'react';
import { Text, TextInput, Button } from 'react-native'
import { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ImageList from './ImagesList';


export default function MarkerScreen({ route, navigation }) {
    const [postText, setPostText] = React.useState('');
    const { marker } = route.params;
    console.log(marker);
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('beforeRemove', () => {
    //         console.log("get back to map");
    //     });
    //     return unsubscribe;
    // }, [navigation]);
    const addImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            alert("success");
        } else {
            alert("fail");
        }
    }

    return (
        <>
            <ImageList />
            <Button
                title="Добавить фото"
                onPress={addImageAsync}
                // onPress={() => {
                //     // Pass and merge params back to home screen
                //     navigation.navigate({
                //         name: 'Home',
                //         params: { post: postText },
                //         merge: true,
                //     });
                // }}
            />
        </>
    );
}