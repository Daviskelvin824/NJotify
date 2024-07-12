import axios from "axios";

export const createtrack = async (
  albumid: number,
  tracknames: string[],
  trackpaths: File[],
) => {
  try {
    const formData = new FormData();
    formData.append("id", albumid.toString());
    tracknames.forEach((trackname, index) => {
      formData.append("tracknames", trackname);
      formData.append("trackpaths", trackpaths[index]);
    });
    await axios.post("http://localhost:8888/create-track", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
    return -1;
  }
};
