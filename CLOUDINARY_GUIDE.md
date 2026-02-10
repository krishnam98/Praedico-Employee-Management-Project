# Cloudinary Integration Guide for Praedico Employee Management

This guide explains how to set up Cloudinary for cloud-based file attachments in your project.

## 1. Prerequisites
- A Cloudinary account (Free tier is sufficient).
- Your Cloudinary credentials:
    - **Cloud Name**
    - **API Key**
    - **API Secret**

## 2. Configuration (`backend/.env`)
Add the following variables to your `backend/.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 3. How it Works
- **Storage**: Files uploaded through the frontend are now sent directly to Cloudinary via the backend.
- **URLs**: Instead of local paths like `uploads/filename.png`, the database now stores secure HTTPS links from Cloudinary (e.g., `https://res.cloudinary.com/...`).
- **Middleware**: The `UploadMiddleware.js` uses `multer-storage-cloudinary` to handle the heavy lifting.

## 4. Troubleshooting
- **Invalid Credentials**: Ensure the `.env` values exactly match your Cloudinary dashboard.
- **Large Files**: The current limit is set to 10MB in `UploadMiddleware.js`.
- **File Types**: Most document and image formats are supported.
