import axios from "axios";

export const getverified = async (
  email: string,
  bannerimage: File,
  aboutme: string,
) => {
  try {
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("banner", bannerimage);
    formdata.append("about", aboutme);

    await axios.post("http://localhost:8888/getverified", formdata, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
