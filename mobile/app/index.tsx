import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton, SecondaryButton } from "../src/components/Button";
import { Screen } from "../src/components/Screen";
import { buildHomeProjection } from "../src/domain/homeProjection";
import { formatCareSummary } from "../src/domain/careState";
import { formatDueLabel } from "../src/domain/date";
import { useCare } from "../src/features/care/CareProvider";
import { useLocalDayNow } from "../src/hooks/useLocalDayNow";
import { colors, radii } from "../src/theme/tokens";

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
              Start with one loved one and one task. You’ll see what needs attention here.
            </Text>
            <PrimaryButton label="Add loved one" onPress={() => router.push("/recipients/new")} />
          </View>
        ) : (
          <>
            {projection.needsAttention.length > 0 ? (
              <View style={[styles.section, styles.attentionSection]}>
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
                <View style={styles.surfaceList}>
                  {projection.today.map((item, index) => (
                    <View key={item.task.id} style={[styles.todayItem, index > 0 && styles.listDivider]}>
                      <View style={styles.taskColumn}>
                        <Text style={styles.recipientName}>{item.recipient.displayName}</Text>
                        <Text style={styles.taskTitle}>{item.task.title}</Text>
                      </View>
                      <Text style={styles.todayLabel}>Due today</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>People you care for</Text>
              <View style={styles.surfaceList}>
                {projection.recipients.map((item, index) => (
                  <View key={item.recipient.id} style={[styles.personRow, index > 0 && styles.listDivider]}>
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
            </View>

            <View style={styles.actionRow}>
              <PrimaryButton label="Add loved one" onPress={() => router.push("/recipients/new")} />
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 28,
    paddingBottom: 48
  },
  hero: {
    gap: 7,
    paddingTop: 6
  },
  greeting: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 36
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  emptyPanel: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.surface,
    gap: 16,
    padding: 20
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.2
  },
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  actionRow: {
    alignItems: "flex-start"
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.2
  },
  attentionSection: {
    backgroundColor: colors.attentionBackground,
    borderRadius: radii.surface,
    gap: 14,
    padding: 17
  },
  attentionItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    minHeight: 48
  },
  surfaceList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.surface,
    borderWidth: 1,
    overflow: "hidden"
  },
  todayItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 13
  },
  listDivider: {
    borderTopColor: colors.separator,
    borderTopWidth: 1
  },
  taskColumn: {
    flex: 1,
    gap: 3,
    minWidth: 0
  },
  recipientName: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  taskTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22
  },
  overdueLabel: {
    backgroundColor: colors.surface,
    borderRadius: radii.control,
    color: colors.attention,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  todayLabel: {
    backgroundColor: colors.primaryBackground,
    borderRadius: radii.control,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  personRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    minHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  personText: {
    flex: 1,
    gap: 3,
    minWidth: 0
  },
  personName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700"
  },
  relationship: {
    color: colors.textMuted,
    fontSize: 13
  },
  summary: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2
  }
});
