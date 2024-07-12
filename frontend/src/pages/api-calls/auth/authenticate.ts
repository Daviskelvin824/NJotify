import axios from "axios";

import type { User } from "../../../model/User";

export const authenticate = async (): Promise<User> => {
  try {
    const response = await axios.get<User>("http://localhost:8888/validate", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user:", error);
    throw error;
  }
};
