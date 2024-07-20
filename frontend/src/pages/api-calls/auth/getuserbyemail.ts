import axios from "axios";

import type { User } from "../../../model/User";

export const getuserbyemail = async (email: string): Promise<User> => {
  try {
    const response = await axios.post<User>(
      "http://localhost:8888/getuserbyemail",
      {
        email,
      }
    );
    const result = response.data;
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
