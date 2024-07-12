import axios from "axios";

export const editprofile = async (
  email: string,
  gender: string,
  dob: Date,
  country: string,
) => {
  try {
    await axios.post(
      "http://localhost:8888/editprofile",
      {
        email: email,
        gender: gender,
        dob: dob,
        country: country,
      },
      {
        withCredentials: true, // Enable credentials (cookies)
      },
    );
  } catch (error) {
    console.log(error);
    return -1;
  }
};
