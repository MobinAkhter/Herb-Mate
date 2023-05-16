import SearchResults from "../components/Home/SearchResults";
import { View, StyleSheet } from "react-native";

function SearchResultScreen({ route }) {
  const { searchVal } = route.params;
  return (
    <View style={styles.rootContainer}>
      <SearchResults searchVal={searchVal} />
    </View>
  );
}

export default SearchResultScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: 25,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 16,
    backgroundColor: "#35D96F",
  },
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
