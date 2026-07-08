import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export function PrimaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#2F5D50",
    borderRadius: 8,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800"
  },
  secondary: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#EEF3EF",
    borderColor: "#C9D7CD",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  secondaryText: {
    color: "#2F5D50",
    fontSize: 15,
    fontWeight: "800"
  },
  pressed: {
    opacity: 0.72
  }
});
