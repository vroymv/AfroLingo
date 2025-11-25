// Image Upload Service for Firebase Storage
import { storage } from "@/config/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTaskSnapshot,
} from "firebase/storage";

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

export interface UploadResult {
  downloadURL: string;
  fullPath: string;
}

/**
 * Uploads a profile image to Firebase Storage
 * @param uri - The local URI of the image to upload
 * @param userId - The user's ID to create a unique filename
 * @param onProgress - Optional callback to track upload progress
 * @returns Promise with the download URL and storage path
 */
export async function uploadProfileImage(
  uri: string,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    // Fetch the image from the local URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}.jpg`;
    const storagePath = `profileimages/${filename}`;

    // Create a storage reference
    const storageRef = ref(storage, storagePath);

    // Upload the file with resumable upload
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Return a promise that resolves when upload is complete
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          // Calculate and report progress
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          if (onProgress) {
            onProgress({
              progress,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
            });
          }
        },
        (error) => {
          // Handle upload errors
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          // Upload completed successfully, get download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              downloadURL,
              fullPath: storagePath,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

/**
 * Validates image file size and type
 * @param uri - The local URI of the image
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Promise<boolean> - true if valid, throws error if invalid
 */
export async function validateImage(
  uri: string,
  maxSizeMB: number = 5
): Promise<boolean> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    // Check file size
    const fileSizeMB = blob.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      throw new Error(`Image size must be less than ${maxSizeMB}MB`);
    }

    // Check file type
    if (!blob.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    return true;
  } catch (error) {
    throw error;
  }
}
