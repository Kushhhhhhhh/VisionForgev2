import cloudinary from "./cloudinary";

const uploadImageToCloudinary = async (
  dataUri: string,
  jobId: string
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: jobId,
      folder: "generated_images",
      overwrite: false,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default uploadImageToCloudinary;