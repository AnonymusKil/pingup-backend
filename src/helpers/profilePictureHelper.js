import cloudinary from "../config/cloudinary.js";
async function uploadProfilePictureToCloudinary(filePath) {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      transformation: [
        {
          width: 400,
          height: 400,
          crop: "fill",
        },
      ],
    });
    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.log("Error Uploading To Cloudinary", error);
    throw new Error("Error Uploading To Cloudinary");
  }
}

export default uploadProfilePictureToCloudinary;
