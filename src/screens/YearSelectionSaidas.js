import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const YearSelectionSaidas = ({ navigation, route }) => {
  const { token } = route.params;

  const fadeIn = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Dispara a animação sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fadeIn.setValue(0);
      translateY.setValue(30);
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 2,
          bounciness: 10,
        }),
      ]).start();
    }, [])
  );

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    return Array.from(
      { length: currentYear - startYear + 1 },
      (_, i) => currentYear - i
    );
  };

  const handleYearPress = (year) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("MonthSelection", { token, selectedYear: year });
    });
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { opacity: fadeIn, transform: [{ translateY }] }]}
      >
        Selecione o Ano
      </Animated.Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.yearButtonsContainer}
      >
        {getYearOptions().map((year) => (
          <Animated.View
            key={year}
            style={{ transform: [{ scale: buttonScale }] }}
          >
            <TouchableOpacity
              style={styles.yearButton}
              onPress={() => handleYearPress(year)}
              activeOpacity={0.7}
            >
              <Text style={styles.yearButtonText}>{year}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0097d9",
    marginBottom: 20,
  },
  yearButtonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  yearButton: {
    minWidth: "24%",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#0097d9",
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  yearButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default YearSelectionSaidas;
