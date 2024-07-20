import axios from "axios";

export const handleacceptartists = async (
  email: string,
  image: string | undefined,
  about: string | undefined,
) => {
  try {
    const response = await axios.post(
      "http://localhost:8888/handleaccept",
      {
        email: email,
        bannerimage: image,
        aboutme: about,
      },
      {
        withCredentials: true,
      },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
