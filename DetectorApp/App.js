import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const { width, height } = Dimensions.get('window');

const App = () => {
    const [model, setModel] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            await tf.ready(); // Espera o TensorFlow.js estar pronto
            const model = await tf.loadGraphModel(bundleResourceIO(require('./assets/model.tflite')));
            setModel(model);
            setIsReady(true);
        };

        const getCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        };

        loadModel();
        getCameraPermission();
    }, []);

    if (hasCameraPermission === null) {
        return <View><Text>Solicitando permissão da câmera...</Text></View>;
    }

    if (hasCameraPermission === false) {
        return <View><Text>Sem acesso à câmera!</Text></View>;
    }

    return (
        <View style={styles.container}>
            {isReady ? (
                <Camera style={styles.camera} />
            ) : (
                <Text>Carregando o modelo...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    camera: {
        width: width,
        height: height,
    },
});

export default App;
