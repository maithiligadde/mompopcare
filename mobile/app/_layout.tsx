import { Stack } from "expo-router";
import { CareProvider } from "../src/features/care/CareProvider";

export default function RootLayout() {
  return (
    <CareProvider>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "700"
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: "#F7F4EF"
          }
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="recipients/new" options={{ title: "Add loved one" }} />
        <Stack.Screen name="recipients/[recipientId]/index" options={{ title: "Care" }} />
        <Stack.Screen name="recipients/[recipientId]/tasks/new" options={{ title: "Add task" }} />
      </Stack>
    </CareProvider>
  );
}
