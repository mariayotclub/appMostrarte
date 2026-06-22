import 'react-native-reanimated';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import Register from './screens/Register';
import RecuperaSenha from './screens/RecuperaSenha';
import MainTabs from './navigation/mainTabs';


export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
  RecuperaSenha: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {

  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
      >

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown:false
          }}
        />


        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            headerShown:false
          }}
        />


        <Stack.Screen
          name="Register"
          component={Register}
        />


        <Stack.Screen
          name="RecuperaSenha"
          component={RecuperaSenha}
        />


      </Stack.Navigator>

    </NavigationContainer>
  );
}