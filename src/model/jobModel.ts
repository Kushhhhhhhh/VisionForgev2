// src/model/jobModel.ts
import mongoose, { Schema, Document, models } from "mongoose";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface IJob extends Document {
  jobId: string;
  userId: string;
  prompt: string;
  aspectRatio: string;
  status: JobStatus;
  imageUrl?: string;
  error?: string;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    jobId:       { type: String, required: true, unique: true },
    userId:      { type: String, required: true },
    prompt:      { type: String, required: true },
    aspectRatio: { type: String, default: "1:1" },
    status:      { type: String, default: "pending" },
    imageUrl:    { type: String },
    error:       { type: String },
    attempts:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobSchema.index({ userId: 1, createdAt: -1 }); // user job history queries
jobSchema.index({ status: 1, createdAt: 1 });  // worker/admin: find pending/processing jobs

export default models.Job || mongoose.model<IJob>("Job", jobSchema);