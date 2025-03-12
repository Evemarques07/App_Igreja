import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native"; // <-- Importação do hook
import HomeTab1 from "../screens/HomeTab1";
import HomeTab2 from "../screens/HomeTab2";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const route = useRoute(); // Obtém a rota atual
  const { token } = route.params || {}; // Evita erro se params for undefined

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Aba 1" component={HomeTab1} initialParams={{ token }} />
      <Tab.Screen name="Aba 2" component={HomeTab2} initialParams={{ token }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
