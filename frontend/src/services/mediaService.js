import axiosInstance from "@/api/axiosInstance";

export async function uploadMedia(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await axiosInstance.post("/media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // data.data is the Cloudinary response ("result")
  return data.data;
}

export async function deleteMedia(publicId) {
  const { data } = await axiosInstance.delete(`/media/delete/${publicId}`);
  return data;
}
