import axios from "axios";

import type { Album } from "../../../model/Album";

export const getalbumbyalbumid = async (albumid: number): Promise<Album> => {
  try {
    const response = await axios.post<Album>(
      "http://localhost:8888/getalbumbyalbumid",
      {
        albumid,
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
