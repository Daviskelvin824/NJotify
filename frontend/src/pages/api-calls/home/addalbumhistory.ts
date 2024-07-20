import axios from "axios";

export const addalbumhistory = async (userid: number, albumid: number) => {
  try {
    await axios.post("http://localhost:8888/addalbumhistory", {
      userid,
      albumid,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
