// Example Usage of Image Upload Functionality
// This file demonstrates various ways to use the image upload feature

import React from "react";
import { View, StyleSheet } from "react-native";
import ImagePickerComponent from "@/components/ui/ImagePicker";
import { useAuth } from "@/contexts/AuthContext";
import { uploadProfileImage, validateImage } from "@/services/imageUpload";

/**
 * Example 1: Basic Usage in Profile Screen
 */
export function ProfileImageExample() {
  const { user, updateProfile } = useAuth();

  const handleImageUploaded = async (url: string) => {
    try {
      await updateProfile({ avatar: url });
      console.log("Profile image updated:", url);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ImagePickerComponent
        currentImageUrl={user?.avatar}
        userId={user?.id || "guest"}
        onImageUploaded={handleImageUploaded}
        size={120}
        showEditBadge={true}
      />
    </View>
  );
}

/**
 * Example 2: Custom Avatar with Progress Tracking
 */
export function CustomAvatarExample() {
  const { user, updateProfile } = useAuth();
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleImageUploaded = async (url: string) => {
    await updateProfile({ avatar: url });
    setUploadProgress(0);
  };

  return (
    <View style={styles.container}>
      <ImagePickerComponent
        currentImageUrl={user?.avatar}
        userId={user?.id || "guest"}
        onImageUploaded={handleImageUploaded}
        size={100}
      />
    </View>
  );
}

/**
 * Example 3: Direct Service Usage (Advanced)
 */
export async function directUploadExample(imageUri: string, userId: string) {
  try {
    // Step 1: Validate the image
    await validateImage(imageUri, 5); // Max 5MB
    console.log("Image validation passed");

    // Step 2: Upload with progress tracking
    const result = await uploadProfileImage(imageUri, userId, (progress) => {
      console.log(`Upload: ${Math.round(progress.progress)}%`);
      console.log(
        `${progress.bytesTransferred} / ${progress.totalBytes} bytes`
      );
    });

    // Step 3: Use the download URL
    console.log("Upload complete!");
    console.log("Download URL:", result.downloadURL);
    console.log("Storage path:", result.fullPath);

    return result.downloadURL;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

/**
 * Example 4: Validation Before Upload
 */
export async function validateBeforeUpload(imageUri: string) {
  try {
    // Validate with custom size limit (3MB)
    await validateImage(imageUri, 3);
    console.log("Image is valid and ready to upload");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Validation failed:", error.message);
    }
    return false;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
