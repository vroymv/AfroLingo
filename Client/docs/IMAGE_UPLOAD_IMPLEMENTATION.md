# Firebase Image Upload Implementation

## Overview

Complete implementation of Firebase Storage image upload functionality for profile pictures. Images are uploaded to the `profileimages` directory in Firebase Storage.

## Features Implemented

### 1. Firebase Storage Configuration

- **File**: `Client/config/firebase.ts`
- Initialized Firebase Storage
- Exported `storage` instance for use throughout the app

### 2. Image Upload Service

- **File**: `Client/services/imageUpload.ts`
- **Functions**:
  - `uploadProfileImage(uri, userId, onProgress)` - Uploads image to Firebase Storage
  - `validateImage(uri, maxSizeMB)` - Validates image size and type
- **Features**:
  - Progress tracking during upload
  - Unique filename generation with timestamp
  - Error handling
  - Returns download URL upon success

### 3. Reusable ImagePicker Component

- **File**: `Client/components/ui/ImagePicker.tsx`
- **Props**:
  - `currentImageUrl`: Current profile image URL
  - `userId`: User ID for unique filename
  - `onImageUploaded`: Callback when upload completes
  - `size`: Avatar size (default: 100)
  - `showEditBadge`: Show edit icon (default: true)
  - `children`: Custom avatar content
- **Features**:
  - Permission handling
  - Image selection with editing (1:1 aspect ratio)
  - Upload progress indicator
  - Success/error alerts
  - Customizable appearance

### 4. ProfileHeader Integration

- **File**: `Client/components/profile/ProfileHeader.tsx`
- Integrated ImagePicker component
- Updates user profile with new image URL
- Displays current user avatar or placeholder

## Usage Examples

### Basic Usage

```tsx
import ImagePickerComponent from "@/components/ui/ImagePicker";
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, updateProfile } = useAuth();

  const handleImageUploaded = async (url: string) => {
    await updateProfile({ avatar: url });
  };

  return (
    <ImagePickerComponent
      currentImageUrl={user?.avatar}
      userId={user?.id || "guest"}
      onImageUploaded={handleImageUploaded}
    />
  );
}
```

### Custom Avatar Content

```tsx
<ImagePickerComponent
  currentImageUrl={user?.avatar}
  userId={user?.id || "guest"}
  onImageUploaded={handleImageUploaded}
  size={120}
>
  <View style={styles.customAvatar}>
    <Image source={{ uri: user?.avatar }} style={styles.image} />
  </View>
</ImagePickerComponent>
```

### Direct Service Usage

```tsx
import { uploadProfileImage, validateImage } from "@/services/imageUpload";

async function uploadImage(uri: string, userId: string) {
  try {
    // Validate image first
    await validateImage(uri, 5); // 5MB max

    // Upload with progress tracking
    const result = await uploadProfileImage(uri, userId, (progress) => {
      console.log(`Upload progress: ${progress.progress}%`);
    });

    console.log("Image URL:", result.downloadURL);
    console.log("Storage path:", result.fullPath);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

## Firebase Storage Structure

```
profileimages/
  ├── userId_timestamp1.jpg
  ├── userId_timestamp2.jpg
  └── ...
```

## Security Considerations

- Images are validated for size (max 5MB by default)
- Images are validated for type (must be image/\*)
- Unique filenames prevent overwrites
- User authentication required (via AuthContext)

## Permissions Required

- Camera roll/media library access
- Automatically requested when user taps avatar

## Error Handling

- Permission denial alerts
- Invalid image alerts
- Upload failure alerts
- Console logging for debugging

## Modular Architecture

All components are fully modular and reusable:

- Service layer handles Firebase operations
- UI component handles user interaction
- Context manages user state
- Can be used anywhere in the app

## Future Enhancements

- Image compression before upload
- Multiple image formats support
- Delete old profile images
- Image cropping improvements
- Offline support with retry logic
