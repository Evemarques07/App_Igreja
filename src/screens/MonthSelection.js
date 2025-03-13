import React, { useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const MonthSelection = ({ navigation, route }) => {
  const { token, selectedYear } = route.params;

  const fadeIn = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

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

  const getMonthOptions = () => {
    return [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ].map((month, index) => ({ name: month, value: index + 1 }));
  };

  const handleMonthPress = (monthValue, scaleAnim) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("Saidas", {
        token,
        selectedYear,
        selectedMonth: monthValue,
      });
    });
  };

  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = screenWidth / 3;

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { opacity: fadeIn, transform: [{ translateY }] }]}
      >
        Selecione o Mês para {selectedYear}:
      </Animated.Text>
      <ScrollView contentContainerStyle={styles.monthButtonsContainer}>
        {getMonthOptions().map((month) => {
          const scaleAnim = useRef(new Animated.Value(1)).current;
          return (
            <Animated.View
              key={month.value}
              style={{ transform: [{ scale: scaleAnim }] }}
            >
              <TouchableOpacity
                style={[styles.monthButton, { width: buttonWidth }]}
                onPress={() => handleMonthPress(month.value, scaleAnim)}
                activeOpacity={0.7}
              >
                <Text style={styles.monthButtonText}>{month.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: "8%",
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
    textAlign: "center",
  },
  monthButtonsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  monthButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: "#0097d9",
    marginHorizontal: 6,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  monthButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
});

export default MonthSelection;
