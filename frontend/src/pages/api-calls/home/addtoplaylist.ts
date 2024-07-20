import axios from "axios";

export const addtoplaylist = async (playlistid: number, trackid: number) => {
  try {
    await axios.post("http://localhost:8888/addtoplaylist", {
      playlistid,
      trackid,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
