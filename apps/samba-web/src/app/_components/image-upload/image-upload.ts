import { Component, input, output, signal, effect } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';

@Component({
  selector: 'app-image-upload',
  imports: [Icon, MatIconButton],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUpload {
  // Input: existing image URL
  imageUrl = input<string | null>(null);

  // Output: new image URL or base64
  imageUrlChange = output<string | null>();

  // Local state
  previewUrl = signal<string | null>(null);
  isDragging = signal(false);
  error = signal<string | null>(null);

  // Max file size: 5MB
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  constructor() {
    // Sync initial imageUrl to preview
    effect(() => {
      const url = this.imageUrl();
      if (url) {
        this.previewUrl.set(url);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.error.set(null);

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
      return;
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.error.set('File size too large. Maximum size is 5MB.');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      this.previewUrl.set(result);
      this.imageUrlChange.emit(result);
    };
    reader.onerror = () => {
      this.error.set('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.previewUrl.set(null);
    this.error.set(null);
    this.imageUrlChange.emit(null);
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('imageUploadInput') as HTMLInputElement;
    fileInput?.click();
  }
}
