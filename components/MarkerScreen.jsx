import React from 'react';
import { Text, TextInput, Button } from 'react-native'
import { useEffect } from 'react';


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
    return (
        <>
            <TextInput
                multiline
                placeholder="What's on your mind?"
                style={{ height: 200, padding: 10, backgroundColor: 'white' }}
                value={postText}
                onChangeText={setPostText}
            />
            <Button
                title="Done"
                onPress={() => {
                    // Pass and merge params back to home screen
                    navigation.navigate({
                        name: 'Home',
                        params: { post: postText },
                        merge: true,
                    });
                }}
            />
        </>
    );
}