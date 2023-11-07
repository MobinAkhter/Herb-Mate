import React from "react";
import {
  View,
  Text,
  ScrollView,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const AboutUsScreen = () => {
  // Function to handle external links; not needed for now, can uncomment later
  //   const handlePress = (url) => {
  //     Linking.canOpenURL(url).then((supported) => {
  //       if (supported) {
  //         Linking.openURL(url);
  //       } else {
  //         console.log(`Don't know how to open URL: ${url}`);
  //       }
  //     });
  //   };

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

      {/* Features Section */}
      {/* <View style={styles.section}>
        <Text style={styles.subHeader}>Features</Text>
        <Text style={styles.text}>
          Explore herbs, discover their uses, and educate yourself on how to use
          them to improve your health.
        </Text>
      </View> */}

      {/* Team Section */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Meet the Team</Text>
        <Text style={styles.text}>
          A passionate team of herbal enthusiasts, discovering the best of
          herbs. Idk what to say here, if we say we are students, nobody will
          take us serious LOL.
        </Text>
      </View>

      {/* Philosophy Section */}
      {/* <View style={styles.section}>
        <Text style={styles.subHeader}>Our Philosophy</Text>
        <Text style={styles.text}>
          We believe in holistic health where mind, body, and environment
          coalesce to form a balanced well-being.
        </Text>
      </View> */}

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.subHeader}>Contact Information</Text>
        <Text style={styles.text}>
          Questions or feedback? We’d love to hear from you. Reach out to us at
          sheridancapstone@gmail.com
        </Text>
      </View>

      {/* Social Media Links. This is how we can add later, when/if we create them.*/}
      {/* <View style={styles.section}>
        <Text style={styles.subHeader}>Follow Us</Text>
        <TouchableOpacity onPress={() => handlePress("#Instagram")}>
          <Text style={styles.link}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("#Facebook")}>
          <Text style={styles.link}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("#Twitter")}>
          <Text style={styles.link}>Twitter</Text>
        </TouchableOpacity>
      </View> */}

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
        {/* <Text style={styles.text}>- "Medical Herbalism" by David Hoffmann</Text> */}
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
    // textAlign: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    color: "#333",
  },
  link: {
    color: "#34A853",
    textDecorationLine: "underline",
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
  },
});

export default AboutUsScreen;
