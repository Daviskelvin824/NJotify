import axios from "axios";

export const sendquery = async (query: string) => {
  try {
    const response = await axios.get(
      `http://localhost:8888/search?query=${query}`,
      {
        withCredentials: true,
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
