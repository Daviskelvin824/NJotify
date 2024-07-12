import axios from "axios";

export const handlerejectartists = async (
  email: string,
  image: string,
  about: string,
) => {
  try {
    const response = await axios.post(
      "http://localhost:8888/handlereject",
      {
        email: email,
        bannerimage: image,
        aboutme: about,
      },
      {
        withCredentials: true, // Enable credentials (cookies)
      },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
