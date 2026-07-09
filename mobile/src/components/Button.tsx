import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii } from "../theme/tokens";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export function PrimaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
    >
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radii.control,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  primaryText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1
  },
  secondary: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primaryBackground,
    borderColor: colors.border,
    borderRadius: radii.control,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.72
  }
});
