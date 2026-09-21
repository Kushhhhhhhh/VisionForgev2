import cloudinary from "./cloudinary";

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

const uploadImageToCloudinary = async (
  dataUri: string,
  jobId: string
): Promise<UploadedImage> => {
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: jobId,
      folder: "generated_images",
      overwrite: false,
    });
    return { url: result.secure_url, width: result.width, height: result.height };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;
