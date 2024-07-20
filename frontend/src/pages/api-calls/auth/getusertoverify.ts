import axios from "axios";

import type { UserVerif } from "../../../model/UserVerif";

export const getusertoverify = async (): Promise<any> => {
  try {
    const response = await axios.get<any>(
      "http://localhost:8888/getusertoverify",
      {
        withCredentials: true,
      },
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
