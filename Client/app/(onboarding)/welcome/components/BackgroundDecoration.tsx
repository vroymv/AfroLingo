import { StyleSheet, View } from "react-native";

interface BackgroundDecorationProps {
  tintColor: string;
}

export default function BackgroundDecoration({
  tintColor,
}: BackgroundDecorationProps) {
  return (
    <View pointerEvents="none" style={styles.decorationLayer}>
      <View
        style={[
          styles.accentCircle,
          styles.accentCircleLarge,
          { borderColor: tintColor },
        ]}
      />
      <View
        style={[
          styles.accentCircle,
          styles.accentCircleSmall,
          { backgroundColor: tintColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  decorationLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  accentCircle: {
    position: "absolute",
    opacity: 0.08,
  },
  accentCircleLarge: {
    width: 420,
    height: 420,
    borderRadius: 210,
    top: -140,
    right: -120,
    borderWidth: 40,
  },
  accentCircleSmall: {
    width: 180,
    height: 180,
    borderRadius: 90,
    left: -60,
    top: 180,
    opacity: 0.1,
  },
});
