import axios from "axios";
import { SingleTrack } from "../../../model/SingleTrack";

export const getpopulartrackbyalbum = async (
  albumid: number
): Promise<SingleTrack[]> => {
  try {
    const response = await axios.post<SingleTrack[]>(
      "http://localhost:8888/getpopulartrackbyalbum",
      { albumid }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
