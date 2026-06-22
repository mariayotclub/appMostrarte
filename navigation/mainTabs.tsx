import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import EventosLista from '../screens/EventosLista';
import Eventos from '../screens/Eventos';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
     screenOptions={{
    headerShown: false,

    tabBarStyle: {
      backgroundColor: '#E5E6C9',
      borderTopColor: '#BDCDD0',
    },

    tabBarActiveTintColor: '#8BA6AC',
    tabBarInactiveTintColor: '#6F8A90',

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="EventosLista"
        component={EventosLista}
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Criar"
        component={Eventos}
        options={{
          title: 'Criar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}