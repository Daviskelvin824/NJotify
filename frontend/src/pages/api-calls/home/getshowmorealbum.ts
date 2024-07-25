import axios from "axios";
import { Album } from "../../../model/Album";

export const getshowmorealbum = async (
  pageNumber: number
): Promise<Album[]> => {
  try {
    const response = await axios.get<Album[]>(
      `http://localhost:8888/showmore/album?pageid=${pageNumber}`,
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
