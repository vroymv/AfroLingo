import { ThemedText } from "@/components/ThemedText";
import { Unit } from "@/data/lessons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { UnitCard } from "./UnitCard";

interface UnitsListProps {
  units: Unit[];
  onUnitPress: (unit: Unit) => void;
}

export const UnitsList = React.memo<UnitsListProps>(
  ({ units, onUnitPress }) => {
    return (
      <View style={styles.unitsSection}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Learning Units
        </ThemedText>

        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onPress={() => onUnitPress(unit)}
            onActionPress={() => onUnitPress(unit)}
          />
        ))}
      </View>
    );
  }
);

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
