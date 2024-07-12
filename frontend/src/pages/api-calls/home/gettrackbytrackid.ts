import axios from "axios";

import type { SingleTrack } from "../../../model/SingleTrack";

export const gettrackbytrackid = async (
  artistid: number,
): Promise<SingleTrack> => {
  try {
    console.log("trackid = ", artistid);
    const response = await axios.post<SingleTrack>(
      "http://localhost:8888/gettracksbytrackid",
      { artistid },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
