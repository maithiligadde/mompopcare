import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../src/components/Button";
import { Screen } from "../../src/components/Screen";
import { TextField } from "../../src/components/TextField";
import { useCare } from "../../src/features/care/CareProvider";

export default function AddRecipientScreen() {
  const { addCareRecipient } = useCare();
  const [name, setName] = useState("");
  const [relationshipLabel, setRelationshipLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    const recipient = addCareRecipient({
      displayName: trimmedName,
      relationshipLabel: relationshipLabel.trim() || undefined
    });

    router.replace({
      pathname: "/recipients/[recipientId]",
      params: { recipientId: recipient.id }
    });
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Add someone you care for</Text>
            <Text style={styles.copy}>
              Start with the name your family uses. Details can stay light while the prototype focuses on coordination.
            </Text>
          </View>

          <View style={styles.form}>
            <TextField label="Name" value={name} onChangeText={setName} placeholder="Mom" />
            <TextField
              label="Relationship label, optional"
              value={relationshipLabel}
              onChangeText={setRelationshipLabel}
              placeholder="Mother"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <PrimaryButton label="Add" onPress={submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  content: {
    gap: 22,
    paddingBottom: 32
  },
  header: {
    gap: 8
  },
  title: {
    color: "#2F3430",
    fontSize: 28,
    fontWeight: "800"
  },
  copy: {
    color: "#58625C",
    fontSize: 16,
    lineHeight: 23
  },
  form: {
    gap: 14
  },
  error: {
    color: "#8D3C17",
    fontSize: 14,
    fontWeight: "700"
  }
});
