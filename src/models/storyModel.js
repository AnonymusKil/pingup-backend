import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    images: [
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

    videos: [
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
    author: {
      type: mongoose.Types.ObjectId,
      ref: "UserModel",
    },
    views: [
      {
        type: mongoose.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const story = mongoose.model("StoryModel", storySchema);
export default story;
