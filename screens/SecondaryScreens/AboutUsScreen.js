import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const AboutUsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About Us</Text>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Our Mission</Text>
        <Text style={styles.text}>
          Dedicated to bringing the best of nature, our herbal app connects you
          to the ancient wisdom of herbs for a balanced lifestyle.
        </Text>
      </View>

      {/* Story Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Our Story</Text>
        <Text style={styles.text}>
          Since 2022, we have been on a mission to make herbal wisdom accessible
          to everyone, bridging ancient remedies with modern technology.
        </Text>
      </View>

      {/* Team Section */}
      {/* <View style={styles.section}>
        <Text style={styles.subHeader}>Meet the Team</Text>
        <Text style={styles.text}>
          A passionate team of herbal enthusiasts, discovering the best of
          herbs.
        </Text>
      </View> */}

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Contact Information</Text>
        <Text style={styles.text}>
          Questions or feedback? We’d love to hear from you. Reach out to us at
          herbmateinfo@gmail.com
        </Text>
      </View>

      {/* Reference Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Reference Materials</Text>
        <Text style={styles.text}>
          Our herbal listings are curated from authoritative sources. To learn
          more, consider these recommended reads:
        </Text>
        <Text style={styles.text}>
          - "Encyclopedia of Herbal Medicine" by Andrew Chevallier
        </Text>
        <Text style={styles.text}>
          - "The Modern Herbal Dispensatory: A Medicine-Making Guide" by Thomas
          Easley | Steven Horne
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#34A853",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34A853",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: "#333",
  },

  section: {
    marginBottom: 10,
  },
});

export default AboutUsScreen;
