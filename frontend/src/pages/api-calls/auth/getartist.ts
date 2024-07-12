import axios from "axios";

import type { User } from "../../../model/User";

export const getartist = async (artistId: number): Promise<User> => {
  try {
    const response = await axios.post<User>("http://localhost:8888/getartist", {
      artistId,
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
