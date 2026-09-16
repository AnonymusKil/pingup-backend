import cloudinary from "../config/cloudinary.js";

function postPictureToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {},
      (error, result) => {
        if (error) {
          console.log("Error Uploading To Cloudinary:", error);
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });
}
export default postPictureToCloudinary;
