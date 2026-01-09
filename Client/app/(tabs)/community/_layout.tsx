import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useNotificationBadge } from "@/contexts/community/NotificationBadgeContext";

const { Navigator } = createMaterialTopTabNavigator();

const TopTabs = withLayoutContext(Navigator);

export default function CommunityLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const { unreadCount } = useNotificationBadge();

  const groupsBadgeCount = unreadCount;

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
            tabBarLabel: ({ color }: { color: string }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color, fontSize: 12, fontWeight: "600" }}>
                  Groups
                </Text>
                {groupsBadgeCount > 0 ? (
                  <View
                    style={{
                      marginLeft: 6,
                      minWidth: 18,
                      paddingHorizontal: 6,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: Colors[colorScheme ?? "light"].tint,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 11,
                        fontWeight: "700",
                      }}
                    >
                      {groupsBadgeCount > 99 ? "99+" : groupsBadgeCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            ),
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
