import axios from "axios";
import { Album } from "../../../model/Album";
import { SingleTrack } from "../../../model/SingleTrack";

export const getshowmoretrack = async (
  pageNumber: number
): Promise<SingleTrack[]> => {
  try {
    const response = await axios.get<SingleTrack[]>(
      `http://localhost:8888/showmore/track?pageid=${pageNumber}`,
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
