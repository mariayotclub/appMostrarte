import React from 'react';

import { 
  createBottomTabNavigator 
} from '@react-navigation/bottom-tabs';

import EventosLista from '../screens/EventosLista';
import Eventos from '../screens/Eventos';


const Tab = createBottomTabNavigator();


export default function MainTabs() {

  return (

    <Tab.Navigator>

      <Tab.Screen
        name="EventosLista"
        component={EventosLista}
        options={{
          title: 'Eventos',
          headerShown:false
        }}
      />


      <Tab.Screen
        name="Criar"
        component={Eventos}
        options={{
          title:'Criar',
          headerShown:false
        }}
      />

    </Tab.Navigator>

  );
}