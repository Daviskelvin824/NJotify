import axios from "axios";

export const signin = async (
  email: string,
  password: string,
): Promise<number | string> => {
  try {
    const response = await axios.post<string>(
      "http://localhost:8888/login",
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
    if (result === "Email is incorrect") return -2;
    else if (result === "Password is incorrect") return -3;
    else if (result === "Activate your Account in Gmail!") return -4;
    return result;
  } catch (error) {
    console.log(error);
    return -1;
  }
};
