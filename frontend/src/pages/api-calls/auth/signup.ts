import axios from "axios";

import type { User } from "../../../model/User";

export const signup = async (user: User): Promise<number | string> => {
  try {
    const response = await axios.post<string>(
      "http://localhost:8888/signup",
      user,
      {
        withCredentials: true,
      },
    );
    const result = response.data;
    if (result === "Password Must be Alphanumeric and has symbol") return -2;
    else if (result === "Invalid email format") return -3;
    else if (result === "Email is already registered") return -4;
    else if (result === "DOB must be in the past!") return -5;
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    return -1;
  }
};
