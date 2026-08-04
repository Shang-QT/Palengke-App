import { useAuth, useUser } from "@clerk/expo";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View>
      <Text>Welcome {user?.primaryEmailAddress?.emailAddress}</Text>
    </View>
  );
}