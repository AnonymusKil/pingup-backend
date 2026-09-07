import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },

    content: {
      type: String,
      default: null,
      trim: true,
    },

    image: [
      {
        url: {
          type: String,
          default: null,
        },
        publicId: {
          type: String,
          default: null,
        },
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserModel",
        },
        content: {
          type: String,
          trim: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model("PostModel", postSchema);

export default Post;
