import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "../../../../src/components/Button";
import { Screen } from "../../../../src/components/Screen";
import { TextField } from "../../../../src/components/TextField";
import { formatDateInput, parseDueInput, toDateInputValue } from "../../../../src/domain/date";
import { getUserScopedRecipient } from "../../../../src/domain/selectors";
import { useCare } from "../../../../src/features/care/CareProvider";

export default function AddTaskScreen() {
  const { recipientId } = useLocalSearchParams<{ recipientId: string }>();
  const { snapshot, user, addCareTask } = useCare();
  const recipient = recipientId ? getUserScopedRecipient(snapshot, user.id, recipientId) : undefined;
  const [title, setTitle] = useState("");
  const [dueInput, setDueInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!recipient) {
      setError("Recipient not found.");
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    const parsedDue = parseDueInput(dueInput);

    if (parsedDue.error) {
      setError(parsedDue.error);
      return;
    }

    addCareTask({
      careRecipientId: recipient.id,
      title: trimmedTitle,
      dueDate: parsedDue.dueDate
    });

    router.replace({
      pathname: "/recipients/[recipientId]",
      params: { recipientId: recipient.id }
    });
  };

  if (!recipient) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Recipient not found</Text>
          <Text style={styles.copy}>This care recipient is unavailable from the current prototype user context.</Text>
          <SecondaryButton label="Back to Home" onPress={() => router.replace("/")} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Add task for {recipient.displayName}</Text>
            <Text style={styles.copy}>Keep it as one clear thing that should happen.</Text>
          </View>

          <View style={styles.form}>
            <TextField label="Task title" value={title} onChangeText={setTitle} placeholder="Call clinic" />
            <TextField
              label="Due date, optional"
              value={dueInput}
              onChangeText={(value) => setDueInput(formatDateInput(value))}
              placeholder="YYYY-MM-DD"
              autoCapitalize="none"
              keyboardType="number-pad"
            />
            <View style={styles.quickRow}>
              <SecondaryButton label="Today" onPress={() => setDueInput(toDateInputValue(new Date()))} />
              <SecondaryButton
                label="Tomorrow"
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDueInput(toDateInputValue(tomorrow));
                }}
              />
              <SecondaryButton label="Clear" onPress={() => setDueInput("")} />
            </View>
            {error ? (
              <Text accessibilityLiveRegion="assertive" accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <PrimaryButton label="Add task" onPress={submit} />
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
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  error: {
    color: "#8D3C17",
    fontSize: 14,
    fontWeight: "700"
  }
});
