import axios from "axios";

export const findaccount = async (email: string) => {
  try {
    const response = await axios.post(
      "http://localhost:8888/findaccount",
      {
        email: email,
      },
      {
        withCredentials: true, // Enable credentials (cookies)
      },
    );
    const result = response.data;

    if (result === "Invalid email format") return -2;
    else if (result === "Account Not Found") return -3;
    else if (result === "Activate your Account in Gmail!") return -4;

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
