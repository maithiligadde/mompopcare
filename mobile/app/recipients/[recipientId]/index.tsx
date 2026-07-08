import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "../../../src/components/Button";
import { Screen } from "../../../src/components/Screen";
import { formatCareSummary, deriveCareState } from "../../../src/domain/careState";
import { formatDueLabel, formatEventTimestamp } from "../../../src/domain/date";
import { getRecipientTasks, getRecentEventsForRecipient } from "../../../src/domain/selectors";
import { useCare } from "../../../src/features/care/CareProvider";

export default function RecipientOverviewScreen() {
  const { recipientId } = useLocalSearchParams<{ recipientId: string }>();
  const { snapshot, completeCareTask } = useCare();
  const recipient = snapshot.careRecipients.find((item) => item.id === recipientId);
  const now = new Date();

  if (!recipient) {
    return (
      <Screen>
        <View style={styles.notFound}>
          <Text style={styles.title}>Recipient not found</Text>
          <SecondaryButton label="Back to Home" onPress={() => router.replace("/")} />
        </View>
      </Screen>
    );
  }

  const tasks = getRecipientTasks(snapshot, recipient.id);
  const openTasks = tasks.filter((task) => task.status === "pending");
  const recentEvents = getRecentEventsForRecipient(snapshot, recipient.id);
  const careState = deriveCareState(tasks, now);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipient.displayName}</Text>
          {recipient.relationshipLabel ? <Text style={styles.relationship}>{recipient.relationshipLabel}</Text> : null}
          <Text style={styles.summary}>{formatCareSummary(careState)}</Text>
        </View>

        <PrimaryButton
          label="Add task"
          onPress={() =>
            router.push({
              pathname: "/recipients/[recipientId]/tasks/new",
              params: { recipientId: recipient.id }
            })
          }
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open tasks</Text>
          {openTasks.length === 0 ? (
            <Text style={styles.muted}>No open tasks.</Text>
          ) : (
            openTasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={styles.taskText}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.dueAt ? <Text style={styles.dueLabel}>{formatDueLabel(task.dueAt, now)}</Text> : null}
                </View>
                <SecondaryButton label="Complete" onPress={() => completeCareTask(task.id)} />
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          {recentEvents.length === 0 ? (
            <Text style={styles.muted}>No recent activity yet.</Text>
          ) : (
            recentEvents.map((event) => (
              <View key={event.id} style={styles.activityRow}>
                <Text style={styles.activityText}>{event.summary}</Text>
                <Text style={styles.activityTime}>{formatEventTimestamp(event.occurredAt)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 22,
    paddingBottom: 36
  },
  notFound: {
    gap: 18
  },
  header: {
    gap: 6
  },
  title: {
    color: "#2F3430",
    fontSize: 32,
    fontWeight: "800"
  },
  relationship: {
    color: "#58625C",
    fontSize: 16
  },
  summary: {
    color: "#2D5E55",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6
  },
  section: {
    gap: 10
  },
  sectionTitle: {
    color: "#2F3430",
    fontSize: 18,
    fontWeight: "800"
  },
  muted: {
    color: "#58625C",
    fontSize: 15,
    lineHeight: 22
  },
  taskRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DED5",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 14
  },
  taskText: {
    flex: 1,
    gap: 4
  },
  taskTitle: {
    color: "#2F3430",
    fontSize: 16,
    fontWeight: "700"
  },
  dueLabel: {
    color: "#58625C",
    fontSize: 13,
    fontWeight: "700"
  },
  activityRow: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DED5",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 14
  },
  activityText: {
    color: "#2F3430",
    fontSize: 16,
    fontWeight: "700"
  },
  activityTime: {
    color: "#58625C",
    fontSize: 13
  }
});
