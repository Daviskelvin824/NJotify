import axios from "axios";

export const validateuserfollowing = async (
  followingid: number,
  followerid: number
): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(
      "http://localhost:8888/validateuserfollowing",
      {
        followingid,
        followerid,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
