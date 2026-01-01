// Reusable Image Picker Component
import React, { useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { uploadProfileImage, validateImage } from "@/services/imageUpload";
import { ImagePickerComponentProps } from "@/types/Profile";

export default function ImagePickerComponent({
  currentImageUrl,
  userId,
  onImageUploaded,
  size = 100,
  showEditBadge = true,
  children,
}: ImagePickerComponentProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const radius = Math.round(size / 2);

  const requestPermissions = useCallback(async () => {
    const { status, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        "Permission Required",
        canAskAgain
          ? "Please grant photo library permissions to upload a profile picture."
          : "Photo library permission is disabled. Enable it in Settings to upload a profile picture."
      );
      return false;
    }
    return true;
  }, []);

  const pickImage = useCallback(async () => {
    try {
      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const firstAsset = result.assets?.[0];
      if (!firstAsset?.uri) {
        Alert.alert("No Image Selected", "Please select an image to continue.");
        return;
      }

      const imageUri = firstAsset.uri;

      // Validate image
      try {
        await validateImage(imageUri);
      } catch (error) {
        Alert.alert(
          "Invalid Image",
          error instanceof Error ? error.message : "Please select a valid image"
        );
        return;
      }

      // Upload image
      setUploading(true);
      setUploadProgress(0);

      const uploadResult = await uploadProfileImage(imageUri, userId, (p) => {
        setUploadProgress(p.progress);
      });

      // Notify parent component
      onImageUploaded(uploadResult.downloadURL);

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Upload Failed", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [requestPermissions, userId, onImageUploaded]);

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={uploading}
      activeOpacity={0.8}
    >
      <View style={[styles.container, { width: size, height: size }]}>
        {typeof currentImageUrl === "string" &&
        currentImageUrl.trim().length > 0 ? (
          <Image
            source={{ uri: currentImageUrl }}
            style={[
              styles.image,
              { width: size, height: size, borderRadius: radius },
            ]}
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              { width: size, height: size, borderRadius: radius },
            ]}
          >
            <ThemedText style={styles.placeholderText}>👤</ThemedText>
          </View>
        )}

        {children && <View style={styles.childrenOverlay}>{children}</View>}

        {uploading && (
          <View style={[styles.uploadingOverlay, { borderRadius: radius }]}>
            <ActivityIndicator size="large" color="#fff" />
            <ThemedText style={styles.progressText}>
              {Math.round(uploadProgress)}%
            </ThemedText>
          </View>
        )}

        {showEditBadge && !uploading && (
          <View style={styles.editBadge}>
            <ThemedText style={styles.editIcon}>✏️</ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    borderRadius: 50,
  },
  childrenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placeholder: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4A90E2",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  editIcon: {
    fontSize: 14,
  },
});
