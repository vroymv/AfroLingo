import { ThemedText } from "@/components/ThemedText";
import { Unit } from "@/data/lessons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { UnitCard } from "./UnitCard";
import { useRouter } from "expo-router";

interface UnitsListProps {
  units: Unit[];
}

export const UnitsList = React.memo<UnitsListProps>(({ units }) => {
  const router = useRouter();
  const handleUnitPress = (unit: Unit) => {
    router.push({
      pathname: "/learn/lesson/[unitId]",
      params: { unitId: unit.id },
    });
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
          onActionPress={() => handleUnitPress(unit)}
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
