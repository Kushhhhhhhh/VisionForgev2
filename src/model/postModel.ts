import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IPost extends Document {
   _id: string; 
  userId: string;
  imageUrl: string;
  prompt: string;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    prompt: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  { timestamps: true }
);

postSchema.index({ userId: 1, createdAt: -1 }); // profile page: user's posts sorted by newest
postSchema.index({ createdAt: -1 });             // gallery sort (also covers cursor pagination via _id)

const Post = models.Post || model<IPost>("Post", postSchema);

export default Post;