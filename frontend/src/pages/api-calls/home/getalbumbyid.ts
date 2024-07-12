import axios from "axios";

import type { Album } from "../../../model/Album";

export const getalbumbyid = async (artistid: number): Promise<Album> => {
  try {
    const response = await axios.post<Album>(
      "http://localhost:8888/getalbumbyid",
      {
        artistid,
      },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
