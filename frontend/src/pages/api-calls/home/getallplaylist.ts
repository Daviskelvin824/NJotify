import axios from "axios";
import { Playlist } from "../../../model/Playlist";
export const getallplaylist = async (): Promise<Playlist[]> => {
  try {
    const response = await axios.get<Playlist[]>(
      "http://localhost:8888/getallplaylist"
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
