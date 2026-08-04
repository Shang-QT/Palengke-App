import { useClerk, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const clerk = useClerk();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.error) {
        throw result.error;
      }

      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err) {
      console.log(err);
    }
  };

  const verifyCode = async () => {
    try {
      const result = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (result.error) {
        throw result.error;
      }

      if (signUp.status === "complete" && signUp.createdSessionId) {
        await clerk.setActive({
          session: signUp.createdSessionId,
        });

        router.replace("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text>Verification Code</Text>

        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="123456"
        />

        <Button title="Verify" onPress={verifyCode} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Email</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />

      <Text>Password</Text>

      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />

      <Button title="Sign Up" onPress={onSignUpPress} />
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
