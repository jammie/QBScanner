import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const { width } = Dimensions.get('screen');

const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.9;


export default function HomeScreen() {
  const tabBarheight = useBottomTabBarHeight();
  const [qrData, setQrData] = React.useState("");
  const [qrComp, setQrComp] = React.useState<QRCodeScanner|null>(null);
  const onSuccess = (e : any) => {

    setQrData(e.data);
    if(qrComp) {
      qrComp.reactivate();
    }
   /*
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err)
    );
    */
  };
  const okayPress = () => {
    if(qrComp) {
      qrComp.reactivate();
    }
    if(qrData) {
      Linking.openURL(qrData).catch(err =>
        console.error('An error occured', err)
      );
    }
  }
  const resetPress = () => {
    if(qrComp) {

      qrComp.reactivate();
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>QRCode Scanner</Text>
      </View>

      {/* Scrollable Content */}
      <View style={styles.scrollContainer}>
        <ScrollView
          indicatorStyle="white"
          contentContainerStyle={[
            styles.scrollContentContainer,
            { paddingBottom: tabBarheight },
          ]}>

        <QRCodeScanner
        ref={(node) => setQrComp(node)}
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.off}
        topContent={
          <Text style={styles.centerText}>
            Isi QR {'\n'}
            <Text style={styles.textBold}> {qrData === '' ? ("masih kosong") : (qrData)} </Text>
            {'\n'}
          </Text>
        }
        bottomContent={
          <>
          <TouchableOpacity style={styles.buttonTouchable} onPress={okayPress}>
            <Text style={styles.buttonText}>Buka Isi QR</Text>
          </TouchableOpacity>
          </>
        }
      />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C0C5C1',
  },
  contentContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 14,
  },
  imageCard: {
    borderRadius: 14,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    marginBottom: 50,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16,
    marginTop: -80,
  }
});
