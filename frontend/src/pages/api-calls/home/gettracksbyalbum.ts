import axios from "axios";

import type { Track } from "../../../model/Track";

export const gettracksbbyalbum = async (artistId: number): Promise<Track> => {
  try {
    const response = await axios.post<Track>(
      "http://localhost:8888/gettracksbyalbum",
      { artistId },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
