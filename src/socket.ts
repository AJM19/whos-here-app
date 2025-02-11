import { io } from "socket.io-client";

const SquareSocket = io("https://whos-here-app.onrender.com"); //http://localhost:3000
export default SquareSocket;
