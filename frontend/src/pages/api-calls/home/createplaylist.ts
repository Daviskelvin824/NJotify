import axios from "axios";

export const createplaylist = async (
  creatorid: number,
  playlistname: string,
  playlistimage: File,
  playlistdesc: string
): Promise<number> => {
  try {
    const formData = new FormData();
    formData.append("title", playlistname);
    formData.append("file", playlistimage);
    formData.append("desc", playlistdesc);
    formData.append("creatorid", creatorid.toString());
    const response = await axios.post<number>(
      "http://localhost:8888/create-playlist",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
