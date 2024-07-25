import axios from "axios";

import type { SingleTrack } from "../../../model/SingleTrack";

export const getrecenttrack = async (
  artistid: number
): Promise<SingleTrack[]> => {
  try {
    const response = await axios.post<SingleTrack[]>(
      "http://localhost:8888/getrecenttrack",
      { artistid }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
