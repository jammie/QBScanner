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
  FlatList,
  Button,
  ToastAndroid,
  TouchableHighlight,
} from 'react-native';

import {
  getDBConnection,
  getQrContentItems,
  saveQrContentItems,
  createTable,
  deleteTable,
  deleteQrContentItems,
} from './../services/db-service';
import {QrContentItem} from './../models';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ReportScreen() {
  const [qrContentItems, setQrContentItems] = React.useState<QrContentItem[]>(
    [],
  );

  const loadDataCallback = async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedQrContentItems = await getQrContentItems(db);
      if (storedQrContentItems.length) {
        setQrContentItems(storedQrContentItems.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const sanitizeURL = (data: string) => {
    let result = '';
    if (data) {
      result = data;
      if (data.indexOf('http') < 0) {
        result = 'http://' + data;
      }
    }
    return result;
  };

  const onPress = (url: string) => {
    if (url) {
      const qrURL = sanitizeURL(url);
      if (qrURL != '') {
        Linking.openURL(qrURL).catch(err =>
          console.error('An error occured', err),
        );
      }
    }
  };

  const onDelete = async (id: number, val: string) => {
    const db = await getDBConnection();
    await deleteQrContentItems(db, id);
    loadDataCallback();
    ToastAndroid.showWithGravityAndOffset(
      `Succesfully Deleting ${val}`,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Log List</Text>
        <FlatList
          data={qrContentItems}
          renderItem={({item, index, separators}) => (
            <>
            <TouchableHighlight
              key={item.id}
              onPress={() => {
                onPress(item.value);
              }}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}>
              <View style={{backgroundColor: 'black', margin: 5, padding: 15}}>
                <Text>
                  <Ionicons name="navigate" color={'white'} size={14} />{' '}
                  {item.value}
                </Text>
              </View>

            </TouchableHighlight>
            <Button title='Delete' onPress={() => {
              onDelete(item.id, item.value);
            }}> 
            </Button>
            </>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  contentContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  title: {
    fontSize: 20,
    color: '#fff',
  },
});
