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
    return {
      folder: 'resumes', // Automatically creates a folder named 'resumes' in your Cloudinary account
      allowed_formats: ['pdf', 'doc', 'docx'], // Only accepts documents
      resource_type: 'raw', // Crucial for non-image files like PDFs/Word docs
      // FIX: Using standard string addition instead of $ symbols!
      public_id: Date.now().toString() + '-' + file.originalname.split('.')[0],
    };
  },
});

// 3. Create the upload middleware
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // limit file size to 5MB
});
