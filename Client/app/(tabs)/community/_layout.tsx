import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const { Navigator } = createMaterialTopTabNavigator();

const TopTabs = withLayoutContext(Navigator);

export default function CommunityLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["top"]}>
      <TopTabs
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          tabBarStyle: {
            backgroundColor,
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tint,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            textTransform: "none",
          },
        }}
      >
        <TopTabs.Screen
          name="index"
          options={{
            title: "Feed",
          }}
        />
        <TopTabs.Screen
          name="groups"
          options={{
            title: "Groups",
          }}
        />
        <TopTabs.Screen
          name="profiles"
          options={{
            title: "Connect",
          }}
        />
      </TopTabs>
    </SafeAreaView>
  );
}
