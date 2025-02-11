import { io } from "socket.io-client";

const SquareSocket = io("https://whos-here-api-production.up.railway.app");
export default SquareSocket;
