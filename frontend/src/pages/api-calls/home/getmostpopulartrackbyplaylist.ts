import axios from "axios";
import { SingleTrack } from "../../../model/SingleTrack";

export const getpopulartrackbyplaylist = async (
  playlistid: number
): Promise<SingleTrack[]> => {
  try {
    const response = await axios.post<SingleTrack[]>(
      "http://localhost:8888/getpopulartrackbyplaylist",
      { playlistid }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
