import { ThemedText } from "@/components/ThemedText";
import { Unit } from "@/data/lessons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { UnitCard } from "./UnitCard";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { touchUnitAccess } from "@/services/unitAccess";

interface UnitsListProps {
  units: Unit[];
}

export const UnitsList = React.memo<UnitsListProps>(({ units }) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleUnitPress = (unit: Unit) => {
    router.push({
      pathname: "/learn/lesson/[unitId]",
      params: { unitId: unit.id },
    });
  };

  const handleUnitActionPress = async (unit: Unit) => {
    if (user?.id) {
      const result = await touchUnitAccess({
        userId: user.id,
        unitId: unit.id,
      });
      if (!result.success) {
        // Best-effort; do not block navigation if the touch fails.
        console.warn("Failed to touch unit access", result.message);
      }
    }

    handleUnitPress(unit);
  };

  return (
    <View style={styles.unitsSection}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        Learning Units
      </ThemedText>

      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onPress={() => handleUnitPress(unit)}
          onActionPress={() => void handleUnitActionPress(unit)}
        />
      ))}
    </View>
  );
});

UnitsList.displayName = "UnitsList";

const styles = StyleSheet.create({
  unitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
});
