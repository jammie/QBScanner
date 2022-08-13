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

import { getDBConnection, getQrContentItems, saveQrContentItems, createTable, deleteTable, deleteQrContentItems } from './../services/db-service';
import { QrContentItem } from './../models';

const { width } = Dimensions.get('screen');

const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 0.9;


export default function HomeScreen() {
  const tabBarheight = useBottomTabBarHeight();
  const [qrData, setQrData] = React.useState("");
  const [qrComp, setQrComp] = React.useState<QRCodeScanner|null>(null);
  const [qrContentItems, setQrContentItems] = React.useState<QrContentItem[]>([]);

  const onSuccess = async (e : any) => {
    await setQrData(e.data);

    addQrContentItem();
    if(qrComp) {
      qrComp.reactivate();
    }
  };

  const loadDataCallback = React.useCallback(async () => {
    try {
      
      //const initQrContentItems = [{ id: 0, value: 'go to shop' }, { id: 1, value: 'eat at least a one healthy foods' }, { id: 2, value: 'Do some exercises' }];
      //const initQrContentItems:any = [];
      const db = await getDBConnection();
      await createTable(db);
      const storedQrContentItems = await getQrContentItems(db);
      if (storedQrContentItems.length) {
        setQrContentItems(storedQrContentItems);
      } else {
        //await saveQrContentItems(db, initQrContentItems);
        //setQrContentItems(initQrContentItems);
      }

    } catch (error) {
      console.error(error);
    }
  }, []);

  const addQrContentItem = async () => {
    if (!qrData.trim()) return;
    if(qrContentItems.length >= 0) { 
      let checkData:any = [];
      qrContentItems.forEach((item) => {
        checkData.push(sanitizeURL(item.value));
      });

      if(checkData.indexOf(sanitizeURL(qrData)) > 0) return;
    };

    try {
      const newQrContentItems = [...qrContentItems, {
        id: qrContentItems.length ? qrContentItems.reduce((acc, cur) => {
          if (cur.id > acc.id) return cur;
          return acc;
        }).id + 1 : 0, value: sanitizeURL(qrData)
      }];
      setQrContentItems(newQrContentItems);
      const db = await getDBConnection();
      await saveQrContentItems(db, newQrContentItems);
      setQrData('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQrContentItem = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteQrContentItems(db, id);
      qrContentItems.splice(id, 1);
      setQrContentItems(qrContentItems.slice(0));
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const sanitizeURL = (data:string) => {
    let result = "";
    if(data) {
      result = data;
      if(data.indexOf("http") < 0) {
        result = "http://" + data;
      }
    }
    return result;
  }
  const okayPress = () => {
    if(qrComp) {
      qrComp.reactivate();
    }
    if(qrData) {
      const qrURL = sanitizeURL(qrData);
      if(qrURL != "") {
        Linking.openURL(qrURL).catch(err =>
          console.error('An error occured', err)
        );
      }
      resetPress();
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
