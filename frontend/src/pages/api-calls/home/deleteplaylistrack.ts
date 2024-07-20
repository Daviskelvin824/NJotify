import axios from "axios";

export const deleteplaylisttrack = async (
  playlistid: number,
  trackid: number
) => {
  try {
    await axios.post("http://localhost:8888/deleteplaylisttrack", {
      playlistid,
      trackid,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
