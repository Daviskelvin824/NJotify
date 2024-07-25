import axios from "axios";

import type { User } from "../../../model/User";

export const getallartist = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(
      "http://localhost:8888/getallartist"
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
