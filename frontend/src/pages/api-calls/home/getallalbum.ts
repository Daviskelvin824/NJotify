import axios from "axios";
import { Album } from "../../../model/Album";
export const getallalbum = async (): Promise<Album[]> => {
  try {
    const response = await axios.get<Album[]>(
      "http://localhost:8888/getallalbum"
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
