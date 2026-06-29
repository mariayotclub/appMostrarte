import React, { useEffect } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

import EventosLista from '../screens/EventosLista';
import Eventos from '../screens/Eventos';

import { useEventosLogic } from '../hooks/useEventoLogic';

const Tab = createBottomTabNavigator();

function LogoutScreen({ navigation }: any) {
  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (error) {
        console.log(error);
      }
    };

    logout();
  }, []);

  return <View />;
}

export default function MainTabs() {
  const { isAdmin } = useEventosLogic();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: isAdmin ? '#1C2C4A' : '#E5E6C9',
          borderTopColor: isAdmin ? '#667EA8' : '#BDCDD0',
        },

        tabBarActiveTintColor: isAdmin ? '#FFFFFF' : '#8BA6AC',
        tabBarInactiveTintColor: isAdmin ? '#667EA8' : '#6F8A90',

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

      <Tab.Screen
        name="Sair"
        component={LogoutScreen}
        options={{
          title: 'Sair',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}