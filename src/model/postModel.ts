import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

  userId: { type: String, required: true },
  imageUrl: { type: String, required: true},
  prompt: { type: String, required: true }

}, {timestamps: true});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;