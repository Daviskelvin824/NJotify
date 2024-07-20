import axios from "axios";
import { Playlist } from "../../../model/Playlist";

export const getplaylistbyid = async (
  playlistid: number
): Promise<Playlist> => {
  try {
    const response = await axios.post<Playlist>(
      "http://localhost:8888/getplaylistbyid",
      {
        playlistid,
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
