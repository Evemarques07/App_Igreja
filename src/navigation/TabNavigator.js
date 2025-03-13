// TabNavigator.js
import React, { useRef, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Text, Animated, View, StyleSheet } from "react-native";

import YearSelection from "../screens/YearSelection";
import YearSelectionSaidas from "../screens/YearSelectionSaidas";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, label, focused }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.3 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={[styles.tabButton, { transform: [{ scale: scaleAnim }] }]}
    >
      <FontAwesome
        name={name}
        size={24}
        color={focused ? "#FF6347" : "#007BFF"}
      />
      <Text
        style={[styles.tabLabel, { color: focused ? "#FF6347" : "#007BFF" }]}
      >
        {label}
      </Text>
    </Animated.View>
  );
};

const TabNavigator = () => {
  const route = useRoute();
  const { token } = route.params || {};

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIcon: ({ focused }) => {
          let iconName, label;

          if (route.name === "Contribuições") {
            iconName = "heart";
            label = "Contribuições";
          } else if (route.name === "Relatórios") {
            iconName = "bar-chart";
            label = "Relatórios";
          }

          return <TabIcon name={iconName} label={label} focused={focused} />;
        },
        tabBarActiveTintColor: "#6200EE",
        tabBarInactiveTintColor: "gray",
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen
        name="Contribuições"
        component={YearSelection}
        initialParams={{ token }}
      />
      <Tab.Screen
        name="Relatórios"
        component={YearSelectionSaidas}
        initialParams={{ token }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: "8%",
    paddingTop: 10,
  },
  tabBarItem: {
    flexDirection: "row",
    flex: 1,
    width: "50%",
  },
  tabButton: {
    alignItems: "center",
    // justifyContent: "center",
    width: 96,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TabNavigator;
