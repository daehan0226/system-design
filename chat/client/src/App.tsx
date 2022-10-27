import { Route, Routes } from "react-router-dom";
import Chatroom from "./pages/chatroom/chatroom.tsx";
import WaitRoom from "./pages/waitroom/waitroom.tsx";
import Home from "./pages/home/home.tsx";
import { io } from "socket.io-client";

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;
console.log(SERVER_PORT);

export const socket = io(`http://localhost:${Number(SERVER_PORT)}/chat`);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/wait" element={<WaitRoom />} />
      <Route path="/room/:roomName" element={<Chatroom />} />
    </Routes>
  );
};

export default App;
