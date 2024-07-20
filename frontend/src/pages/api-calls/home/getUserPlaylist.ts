import axios from "axios";

import { Playlist } from "../../../model/Playlist";

export const getuserplaylist = async (userId: number): Promise<Playlist[]> => {
  try {
    const response = await axios.post<Playlist[]>(
      "http://localhost:8888/getuserplaylist",
      {
        userId,
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
