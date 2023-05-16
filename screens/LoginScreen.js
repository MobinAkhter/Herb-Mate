import AuthContent from "../components/Auth/AuthContent";
import { View } from "react-native";
// import FlatButton from "../components/ui/FlatButton";

const LoginScreen = ({ navigation }) => {
  return (
    <View>
      <AuthContent isLogin />
    </View>
  );
};

export default LoginScreen;
