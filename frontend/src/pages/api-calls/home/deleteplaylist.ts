import axios from "axios";

export const deleteplaylist = async (playlistid: number) => {
  try {
    await axios.post("http://localhost:8888/deleteplaylist", { playlistid });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
