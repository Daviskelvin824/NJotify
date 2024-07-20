import axios from "axios";

export const addtrackhistory = async (userid: number, trackid: number) => {
  try {
    await axios.post("http://localhost:8888/addtrackhistory", {
      userid,
      trackid,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
