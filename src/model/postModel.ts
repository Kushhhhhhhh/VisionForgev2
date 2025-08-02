import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IPost extends Document {
   _id: string; 
  userId: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    prompt: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = models.Post || model<IPost>("Post", postSchema);

export default Post;