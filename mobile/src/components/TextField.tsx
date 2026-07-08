import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#8A938D" style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8
  },
  label: {
    color: "#2F3430",
    fontSize: 15,
    fontWeight: "800"
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8D1C7",
    borderRadius: 8,
    borderWidth: 1,
    color: "#2F3430",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12
  }
});
