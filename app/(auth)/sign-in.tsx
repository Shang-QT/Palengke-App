import { useClerk, useSignIn } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function SignInScreen() {
  const { signIn } = useSignIn();
  const clerk = useClerk();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    try {
      const result = await signIn.create({
        identifier: email,
      });

      if (result.error) {
        throw result.error;
      }

      const passwordResult = await signIn.password({
        password,
      });

      if (passwordResult.error) {
        throw passwordResult.error;
      }

      if (signIn.status === "complete" && signIn.createdSessionId) {
        await clerk.setActive({
          session: signIn.createdSessionId,
        });

        router.replace("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Sign In" onPress={onSignInPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
});
