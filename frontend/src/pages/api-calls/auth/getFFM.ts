import axios from "axios";

import { FFM } from "../../../model/FFM";

export const getFFM = async (artistid: number): Promise<FFM> => {
  try {
    const response = await axios.post<FFM>("http://localhost:8888/getFFM", {
      artistid,
    });
    const result = response.data;
    console.log("FFM = ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
