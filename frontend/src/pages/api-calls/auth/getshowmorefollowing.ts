import axios from "axios";
import { User } from "../../../model/User";

export const getshowmorefollowing = async (
  pageNumber: number,
  userId: number
): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(
      `http://localhost:8888/showmore/following?pageid=${pageNumber}&userId=${userId}`,
      {
        withCredentials: true,
      }
    );
    const result = response.data;
    console.log("show more play = ", result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
