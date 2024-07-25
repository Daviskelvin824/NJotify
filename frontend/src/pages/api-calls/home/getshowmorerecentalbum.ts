import axios from "axios";
import { Album } from "../../../model/Album";

export const getshowmorerecentalbum = async (
  pageNumber: number
): Promise<Album[]> => {
  try {
    const response = await axios.get<Album[]>(
      `http://localhost:8888/showmore/recentalbum?pageid=${pageNumber}`,
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
