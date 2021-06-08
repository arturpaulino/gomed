import React from "react";
import { Platform } from "react-native"
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {useTheme} from "styled-components";
import {MaterialIcons} from "@expo/vector-icons";

import {Dashboard} from "../screens/Dashboard";
import {Register} from "../screens/Register";
import {Receita} from "../screens/RegisterReceita";

import {Resume} from "../screens/Resume";
import theme from "../global/styles/theme";

const {Navigator, Screen} = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();
  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: theme.colors.secondary,
        inatictiveColor: theme.colors.text,
        labelPosition: 'beside-icon',
        style: {
             paddingVertical: Platform.OS==='ios'? 20 : 0 ,
             height: 60 ,

        }
      }}
    >
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="Conulstas"
        component={Register}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons
              name="medical-services"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="Receitas"
        component={Receita}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons
              name="recent-actors"
              size={size}
              color={color}
            />
          ),
        }}
      />


    </Navigator>
  );
}
