import { io } from "socket.io-client";

const SquareSocket = io("http://localhost:3000");
export default SquareSocket;
