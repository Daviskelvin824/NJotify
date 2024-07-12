import axios from "axios";

export const logout = async (): Promise<string> => {
  try {
    const response = await axios.get<string>("http://localhost:8888/logout", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return "Error";
  }
};
