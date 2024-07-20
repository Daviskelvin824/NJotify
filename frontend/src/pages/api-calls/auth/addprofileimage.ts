import axios from "axios";

export const addprofileimage = async (email: string, profileimage: File) => {
  try {
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("profileimg", profileimage);

    await axios.post("http://localhost:8888/addprofileimage", formdata, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
