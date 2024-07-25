import axios from "axios";
import { SingleTrack } from "../../../model/SingleTrack";
export const getalltrack = async (): Promise<SingleTrack[]> => {
  try {
    const response = await axios.get<SingleTrack[]>(
      "http://localhost:8888/getalltrack"
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
