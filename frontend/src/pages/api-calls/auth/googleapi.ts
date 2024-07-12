import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const googleapi = async (token: any) => {
  try {
    const response = await axios.post(
      "http://localhost:8888/auth/google/callback",
      { code: token },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
