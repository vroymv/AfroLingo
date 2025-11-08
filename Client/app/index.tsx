import { Redirect } from "expo-router";

// This ensures users are redirected to the proper flow based on auth state
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
