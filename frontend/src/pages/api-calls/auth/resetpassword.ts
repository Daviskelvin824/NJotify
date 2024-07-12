import axios from "axios";

export const resetpassword = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      "http://localhost:8888/resetpassword",
      {
        email: email,
        password: password,
      },
      {
        withCredentials: true, // Enable credentials (cookies)
      },
    );
    const result = response.data;
    console.log(result);
    if (result === "Invalid Password Format!") return -2;
    else if (result === "New password cannot be the same as the old password")
      return -3;
    else if (result === "Activate your Account in Gmail!") return -4;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
