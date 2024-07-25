import axios from "axios";

export const unfollowperson = async (
  followingid: number,
  followerid: number
) => {
  try {
    await axios.post("http://localhost:8888/unfollowperson", {
      followingid,
      followerid,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
