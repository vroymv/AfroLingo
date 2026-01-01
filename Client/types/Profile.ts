export interface ImagePickerComponentProps {
  currentImageUrl?: string;
  userId: string;
  onImageUploaded: (url: string) => void;
  size?: number;
  showEditBadge?: boolean;
  children?: React.ReactNode;
}
