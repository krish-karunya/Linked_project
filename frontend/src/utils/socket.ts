import { io } from "socket.io-client";

export function createSocketConnection() {
  return io("http://localhost:7000");
}
