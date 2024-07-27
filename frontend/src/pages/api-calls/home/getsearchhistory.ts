import axios from "axios";
import { SearchHistory } from "../../../model/SearchHistory";

export const getsearchhistory = async (
  userid: number
): Promise<SearchHistory[]> => {
  try {
    const response = await axios.get<SearchHistory[]>(
      `http://localhost:8888/getsearchhistory?userid=${userid}`,
      {
        withCredentials: true,
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
