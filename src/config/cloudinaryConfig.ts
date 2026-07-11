import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Extract the file extension (e.g., 'pdf', 'docx', 'zip')
    const ext = file.originalname.split('.').pop();
    // Extract the file name without the extension
    const baseName = file.originalname.split('.')[0];

    return {
      folder: 'resumes', 
      resource_type: 'raw', 
      // 🚀 CHANGED: Explicitly forcing the format so it doesn't say "N/A"
      format: ext, 
      public_id: Date.now().toString() + '-' + baseName,
    };
  },
});

// 3. Create the upload middleware
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // limit file size to 5MB
});