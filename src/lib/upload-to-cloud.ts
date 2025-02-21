import axios from "axios";
import cloudinary from "./cloudinary";

interface CloudinaryUploadResponse {
  secure_url: string;
}

const uploadImageToCloudinary = async (
  imageUrl: string,
  prompt: string
): Promise<string> => {
  try {
    // Step 1: Fetch the image as binary data
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Step 2: Convert the binary data to a base64 string
    const base64Image = Buffer.from(response.data).toString("base64");

    // Step 3: Upload the base64 image to Cloudinary
    const uploadResponse: CloudinaryUploadResponse = await cloudinary.uploader.upload(
      `data:image/webp;base64,${base64Image}`,
      {
        public_id: prompt.replace(/\s+/g, "_"),
        folder: "generated_images",
        overwrite: true,
        invalidate: true,
      }
    );

    // Step 4: Return the secure URL of the uploaded image
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;