import cloudinary from "../config/cloudinary.js";

async function uploadStoryMediaToCloudinary(filePath) {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto", // This allows Cloudinary to handle both images and videos
    });
    return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
  } catch (error) {
    console.error("Error uploading media to Cloudinary:", error);
    throw error;
  }
}

export default uploadStoryMediaToCloudinary;
