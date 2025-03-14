// AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Home from "../screens/Home";
import YearSelection from "../screens/YearSelection";
import Contributions from "../screens/Contributions";
import YearSelectionSaidas from "../screens/YearSelectionSaidas";
import MonthSelection from "../screens/MonthSelection";
import Saidas from "../screens/Saidas";
import ChangePassword from "../screens/ChangePassword";
import ChangeUsername from "../screens/ChangeUsername";
import Avisos from "../screens/Avisos";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="YearSelection"
          component={YearSelection}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Contributions"
          component={Contributions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="YearSelectionSaidas"
          component={YearSelectionSaidas}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MonthSelection"
          component={MonthSelection}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Saidas"
          component={Saidas}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangeUsername"
          component={ChangeUsername}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Avisos"
          component={Avisos}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
