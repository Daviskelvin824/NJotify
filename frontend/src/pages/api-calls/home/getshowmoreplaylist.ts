import axios from "axios";
import { Album } from "../../../model/Album";

export const getshowmoreplaylist = async (
  pageNumber: number,
  creatorId: number
): Promise<Album[]> => {
  try {
    const response = await axios.get<Album[]>(
      `http://localhost:8888/showmore/playlist?pageid=${pageNumber}&creatorid=${creatorId}`,
      {
        withCredentials: true,
      }
    );
    const result = response.data;
    console.log("show more play = ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
