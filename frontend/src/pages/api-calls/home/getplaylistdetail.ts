import axios from "axios";
import { PlaylistDetail } from "../../../model/PlaylistDetail";

export const getplaylistdetail = async (
  playlistid: number
): Promise<PlaylistDetail[]> => {
  try {
    const response = await axios.post<PlaylistDetail[]>(
      "http://localhost:8888/getplaylistdetail",
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
