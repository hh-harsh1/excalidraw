import axios from "axios";
import { BACKEND_URL } from "../config/config";

export default async function useCreateRoom(room: string) {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${BACKEND_URL}/api/v1/user/create`,
    { room },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response);
  return response;
}
