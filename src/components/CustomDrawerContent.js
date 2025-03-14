// src/components/CustomDrawerContent.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { jwtDecode } from "jwt-decode";
import TabNavigator from "../navigation/TabNavigator";

const CustomDrawerContent = (props) => {
  // Acesse o token através das props
  const { decodedToken, token } = props;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Menu</Text>
      </View>
      <DrawerItemList {...props} />

      {/* <TouchableOpacity
        style={styles.drawerItem}
        component={TabNavigator}
        onPress={() => {
          props.navigation.navigate("ChangeUsername", { token });
        }}
      >
        <Text style={styles.drawerItemText}>Alterar Nome de Usuário</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.navigate("ChangePassword", { token });
        }}
      >
        <Text style={styles.drawerItemText}>Alterar Senha</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
      >
        <Text style={styles.drawerItemText}>Sair</Text>
      </TouchableOpacity> */}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    borderRadius: 8,
    backgroundColor: "#0097d9",
    padding: 20,
    marginBottom: 10,
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  drawerItemText: {
    fontSize: 16,
  },
});

export default CustomDrawerContent;
