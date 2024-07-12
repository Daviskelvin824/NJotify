import axios from "axios";

export const createalbum = async (
  album: string,
  file: File,
  type: string,
): Promise<number> => {
  try {
    const formData = new FormData();
    formData.append("name", album);
    formData.append("file", file);
    formData.append("type", type);
    const response = await axios.post<number>(
      "http://localhost:8888/create-album",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
