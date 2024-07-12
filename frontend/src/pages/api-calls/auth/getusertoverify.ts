import axios from "axios";

export const getusertoverify = async () => {
  try {
    const response = await axios.get("http://localhost:8888/getusertoverify", {
      withCredentials: true,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
