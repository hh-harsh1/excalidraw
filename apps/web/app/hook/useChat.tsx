import axios from "axios";
import { BACKEND_URL } from "../config/config";

export default async function useChat(roomId: string) {
  const response = axios.get(`${BACKEND_URL}/chat/${roomId}`);
  //@ts-ignore
  const messages = (await response).data.chats;

  const shapes = messages.map((x: { message: string }) => {
    const messagedata = JSON.parse(x.message);
    return messagedata.shape;
  });

  console.log(shapes);
  return shapes;
}
