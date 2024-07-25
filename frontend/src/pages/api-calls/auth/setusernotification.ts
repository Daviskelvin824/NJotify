import axios from "axios";

export const setusernotification = async (
  artistEmail: boolean,
  artistPush: boolean,
  followerEmail: boolean,
  followerPush: boolean
) => {
  try {
    let artistnotif = "";
    let followernotif = "";
    if (artistEmail && artistPush) {
      artistnotif = "both";
    } else if (artistEmail) {
      artistnotif = "email";
    } else if (artistPush) {
      artistnotif = "push";
    } else {
      artistnotif = "";
    }

    if (followerEmail && followerPush) {
      followernotif = "both";
    } else if (followerEmail) {
      followernotif = "email";
    } else if (followernotif) {
      followernotif = "push";
    } else {
      followernotif = "";
    }

    await axios.post(
      "http://localhost:8888/updateusernotif",
      {
        artistnotif,
        followernotif,
      },
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log(error);
    return -1;
  }
};
