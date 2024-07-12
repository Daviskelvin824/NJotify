import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verifyAccount = async (token: any) => {
  try {
    const response = await axios.get(
      "http://localhost:8888/verify?token=" + token,
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
