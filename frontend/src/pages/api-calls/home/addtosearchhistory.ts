import axios from "axios";

export const addtosearchhistory = async (
  userId: number,
  resultId: number,
  resultType: string
) => {
  try {
    await axios.post("http://localhost:8888/addtosearchhistory", {
      userId,
      resultId,
      resultType,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
