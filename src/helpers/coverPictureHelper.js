import cloudinary from "../config/cloudinary.js";

function uploadCoverPictureToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        transformation: [
          {
            width: 1500,
            height: 500,
            crop: "fill",
          },
        ],
      },
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

export default uploadCoverPictureToCloudinary;