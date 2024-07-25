import axios from "axios";

export const followperson = async (followingid: number, followerid: number) => {
  try {
    await axios.post("http://localhost:8888/followperson", {
      followingid,
      followerid,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
