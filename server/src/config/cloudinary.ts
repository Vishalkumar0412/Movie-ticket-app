import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { z } from 'zod';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define allowed file types
const ALLOWED_FILE_TYPES = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4'
};

// Validate environment variables
const envSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Missing required environment variables for Cloudinary:');
    error.errors.forEach(err => {
      console.error(`- ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
}

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'movie-ticket-app',
    allowed_formats: Object.values(ALLOWED_FILE_TYPES),
    resource_type: 'auto',
  } as any,
});

// File filter function
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!Object.keys(ALLOWED_FILE_TYPES).includes(file.mimetype)) {
    cb(new Error('File type not supported. Supported types: JPEG, PNG, WebP, MP4'));
    return;
  }
  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Export configured instances
export { cloudinary, upload };

// Export helper functions
export const deleteCloudinaryAsset = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting Cloudinary asset:', error);
    return false;
  }
};