import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './../screens/HomeScreen';
import Report from './../screens/ReportScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator  initialRouteName="Home" screenOptions={{ headerShown: false,
      tabBarActiveTintColor: '#3F334D',
      tabBarInactiveTintColor: '#574B60',
      tabBarShowLabel: false,
      tabBarStyle: {
      backgroundColor: '#7D8491'
    }
   }} >
      <Tab.Screen name="Home" component={Home} options={{
        tabBarLabel: 'Utama',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={color} size={size} />
        ),
      }}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
