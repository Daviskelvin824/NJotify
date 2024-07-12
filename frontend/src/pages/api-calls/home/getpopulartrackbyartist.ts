import axios from "axios";

import type { PopularTrack } from "../../../model/PopularTrack";

export const getpopulartrackbyartist = async (
  artistid: number,
): Promise<PopularTrack[]> => {
  try {
    const response = await axios.post<PopularTrack[]>(
      "http://localhost:8888/getpopulartrackbyartist",
      { artistid },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
