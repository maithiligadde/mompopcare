import { Stack } from "expo-router";
import { CareProvider } from "../src/features/care/CareProvider";
import { colors } from "../src/theme/tokens";

export default function RootLayout() {
  return (
    <CareProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: "700"
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background
          }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
        <Stack.Screen name="recipients/new" options={{ title: "Add loved one" }} />
        <Stack.Screen name="recipients/[recipientId]/index" options={{ title: "Care" }} />
        <Stack.Screen name="recipients/[recipientId]/tasks/new" options={{ title: "Add task" }} />
      </Stack>
    </CareProvider>
  );
}
