import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function RecommendedRemedyReviewScreen({ route }) {
  const { condition } = route.params;
  const { category } = route.params;
  const { age } = route.params;
  const { rating } = route.params;
  const { gender } = route.params;
  const { sex } = route.params;
  const { userQuestion } = route.params;
  const [severity, setSeverity] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    if (rating == "1") {
      setSeverity("Low");
    } else if (rating == "2") {
      setSeverity("Moderate");
    } else if (rating == "3") {
      setSeverity("Concerning");
    } else if (rating == "4") {
      setSeverity("Serious");
    } else if (rating == "5") {
      setSeverity("Critical");
    }
    console.log("This is  " + userQuestion);
  });

  function buttonClick() {
    let ageGroup = "";

    if (age < 30) {
      ageGroup = "18 to 29";
    } else if (age >= 30 && age < 50) {
      ageGroup = "30 to 49";
    } else {
      ageGroup = "50 and over";
    }

    let area = category;

    if (category == "Digestive Wellness") {
      area = "Digestive Health";
    } else if (category == "Women's Health") {
      area = "Women’s Health";
    }

    navigation.navigate("RecommendedRemedyScreen", {
      category: area,
      question: condition,
      age: ageGroup,
      gender: "Both",
      rating: rating,
      severity: severity,
      userAge: age,
      sex: sex,
      userQuestion: userQuestion,
    });
  }

  return (
    <>
      <View style={styles.rootContainer}>
        <Text style={styles.title}> Review </Text>

        <View style={styles.subContainer}>
          <View style={styles.textPosition}>
            <Text
              style={[
                { color: "black" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              Category:
            </Text>
            <Text
              style={[
                { color: "black" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              Condition:
            </Text>
            <Text
              style={[
                { color: "black" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              Biological Sex:
            </Text>
            <Text
              style={[
                { color: "black" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              Age:
            </Text>
            <Text
              style={[
                { color: "black" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              Level of Severity:
            </Text>
          </View>

          <View style={styles.textPosition}>
            <Text
              style={[
                { color: "green" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              {category}
            </Text>
            <Text
              style={[
                { color: "green" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              {userQuestion}
            </Text>
            <Text
              style={[
                { color: "green" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              {sex}
            </Text>
            <Text
              style={[
                { color: "green" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              {age}
            </Text>
            <Text
              style={[
                { color: "green" },
                { fontWeight: "bold" },
                { marginBottom: 30 },
              ]}
            >
              {" "}
              {severity}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={buttonClick}>
          <Text style={styles.buttonText}> CONTINUE </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default RecommendedRemedyReviewScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  textPosition: {
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  subContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#32cd32",
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    paddingBottom: 10,
  },
  warning: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
    fontStyle: "italic",
  },
  continueButton: {
    borderRadius: 10,
    borderWidth: 1.5,

    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#1e90ff",
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e90ff",
  },
});
