import React from 'react';
import { Text } from 'react-native'


export default function HelloWorldScreen({ route, navigation }) {
    const { coordinate } = route.params;
    return (
        <Text>
            {JSON.stringify(coordinate)}
        </Text>
    );
}