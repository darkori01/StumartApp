import { Platform } from 'react-native';

const CLOUD_NAME = 'bgo4jhrc';
const UPLOAD_PRESET = 'stumart_unsigned';

export async function uploadToCloudinary(localUri) {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const response = await fetch(localUri);
    const blob = await response.blob();
    formData.append('file', blob, 'upload.jpg');
  } else {
    formData.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
  }

  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  if (!data.secure_url) {
    console.error('Cloudinary response:', data);
    throw new Error('Cloudinary upload failed');
  }
  return data.secure_url;
}

