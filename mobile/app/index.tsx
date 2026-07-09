import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { buildHomeProjection } from "../src/domain/homeProjection";
import { formatCareSummary } from "../src/domain/careState";
import { formatDueLabel } from "../src/domain/date";
import { useCare } from "../src/features/care/CareProvider";
import { useLocalDayNow } from "../src/hooks/useLocalDayNow";

export default function HomeScreen() {
  const { snapshot, user } = useCare();
  const now = useLocalDayNow();
  const projection = buildHomeProjection(snapshot, user.id, now);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Hi, {user.displayName}</Text>
          <Text style={styles.subtitle}>
            Keep track of what needs attention without turning care into a dashboard of noise.
          </Text>
        </View>

        {projection.recipients.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyTitle}>Add someone you care for</Text>
            <Text style={styles.emptyCopy}>
              Start with a loved one and one task. Prototype data is in memory and resets when the app reloads.
            </Text>
            <PrimaryButton label="Add loved one" onPress={() => router.push("/recipients/new")} />
          </View>
        ) : (
          <>
            <View style={styles.actionRow}>
              <PrimaryButton label="Add loved one" onPress={() => router.push("/recipients/new")} />
            </View>

            {projection.needsAttention.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Needs attention</Text>
                {projection.needsAttention.map((item) => (
                  <View key={item.task.id} style={styles.attentionItem}>
                    <View style={styles.taskColumn}>
                      <Text style={styles.recipientName}>{item.recipient.displayName}</Text>
                      <Text style={styles.taskTitle}>{item.task.title}</Text>
                    </View>
                    <Text style={styles.overdueLabel}>{formatDueLabel(item.task.dueDate, now)}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {projection.today.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today</Text>
                {projection.today.map((item) => (
                  <View key={item.task.id} style={styles.todayItem}>
                    <View style={styles.taskColumn}>
                      <Text style={styles.recipientName}>{item.recipient.displayName}</Text>
                      <Text style={styles.taskTitle}>{item.task.title}</Text>
                    </View>
                    <Text style={styles.todayLabel}>Due today</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>People you care for</Text>
              {projection.recipients.map((item) => (
                <View key={item.recipient.id} style={styles.personRow}>
                  <View style={styles.personText}>
                    <Text style={styles.personName}>{item.recipient.displayName}</Text>
                    {item.recipient.relationshipLabel ? (
                      <Text style={styles.relationship}>{item.recipient.relationshipLabel}</Text>
                    ) : null}
                    <Text style={styles.summary}>{formatCareSummary(item.careState)}</Text>
                  </View>
                  <SecondaryButton
                    label="Open"
                    onPress={() =>
                      router.push({
                        pathname: "/recipients/[recipientId]",
                        params: { recipientId: item.recipient.id }
                      })
                    }
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    paddingBottom: 36
  },
  hero: {
    gap: 8
  },
  greeting: {
    color: "#2F3430",
    fontSize: 32,
    fontWeight: "800"
  },
  subtitle: {
    color: "#58625C",
    fontSize: 16,
    lineHeight: 23
  },
  emptyPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4DED5",
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 18
  },
  emptyTitle: {
    color: "#2F3430",
    fontSize: 22,
    fontWeight: "800"
  },
  emptyCopy: {
    color: "#58625C",
    fontSize: 15,
    lineHeight: 22
  },
  actionRow: {
    alignItems: "flex-start"
  },
  section: {
    gap: 10
  },
  sectionTitle: {
    color: "#2F3430",
    fontSize: 18,
    fontWeight: "800"
  },
  attentionItem: {
    alignItems: "center",
    backgroundColor: "#FFF9F5",
    borderColor: "#DFAE85",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    padding: 14
  },
  todayItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D8E1D8",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    padding: 14
  },
  taskColumn: {
    flex: 1,
    minWidth: 0
  },
  recipientName: {
    color: "#58625C",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  taskTitle: {
    color: "#2F3430",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2
  },
  overdueLabel: {
    color: "#8D3C17",
    fontSize: 13,
    fontWeight: "800"
  },
  todayLabel: {
    color: "#2D5E55",
    fontSize: 13,
    fontWeight: "800"
  },
  personRow: {
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
  personText: {
    flex: 1,
    gap: 3
  },
  personName: {
    color: "#2F3430",
    fontSize: 18,
    fontWeight: "800"
  },
  relationship: {
    color: "#58625C",
    fontSize: 14
  },
  summary: {
    color: "#58625C",
    fontSize: 14,
    marginTop: 3
  }
});
