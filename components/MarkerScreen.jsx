import React from 'react';
import { Text, TextInput, Button } from 'react-native'
import { useEffect } from 'react';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import ImageList from './ImagesList';




export default function MarkerScreen({ route, navigation }) {
    const [postText, setPostText] = React.useState('');
    const [images, setImages] = useState([]);
    const { marker_id } = route.params;
    useEffect(() => {
        global.db.transaction((tx) => {
            tx.executeSql("SELECT * FROM image WHERE marker_id = ?;", [marker_id], (_, rows) =>
                setImages(rows.rows._array)
            );
        });
    })

    const addImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            global.db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO image (uri, marker_id) VALUES (?, ?);",
                    [result.assets[0].uri, marker_id],
                    (_, rows) =>
                    setImages([...images, {
                        id: rows.insertId,
                        uri: result.assets[0].uri,
                    }])
                )
            })
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
        </>
    );
}