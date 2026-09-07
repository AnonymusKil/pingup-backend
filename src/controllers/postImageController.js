import postModel from "../models/postmodel.js";
import User from "../models/usermodel.js";
import postPictureToCloudinary from "../helpers/postImageHelper.js";
import cloudinary from "../config/cloudinary.js";

export async function uploadPostPicture(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const userId = req.userInfo.userId;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post",
      });
    }

    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const { url, publicId } = await postPictureToCloudinary(file.path);

        return {
          url,
          publicId,
        };
      }),
    );

    post.image.push(...uploadedImages);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post images uploaded successfully",
      post,
    });
  } catch (error) {
    console.log("Error Uploading Post Images:", error);

    return res.status(500).json({
      success: false,
      message: "Error uploading post images",
    });
  }
}

// export async function deletePostImage(req, res) {
//   try {
//     const userId = req.userInfo.userId;
//     const postId = req.params.postId;
//     const publicId = req.params.publicId;

//     const post = await postModel.findById(postId);

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//       });
//     }

//     if (post.author.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to edit this post",
//       });
//     }

//     const imageIndex = post.image.findIndex(
//       (image) => image.publicId === publicId
//     );

//     if (imageIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Image not found in this post",
//       });
//     }

//     const imageToDelete = post.image[imageIndex];

//     post.image.splice(imageIndex, 1);

//     await post.save();

//     if (imageToDelete.publicId) {
//       await cloudinary.uploader.destroy(imageToDelete.publicId);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Post image deleted successfully",
//       post,
//     });
//   } catch (error) {
//     console.log("Error Deleting Post Image:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Error deleting post image",
//     });
//   }
// }
export default uploadPostPicture;
