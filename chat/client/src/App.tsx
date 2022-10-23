import { Route, Routes } from "react-router-dom";
import Chatroom from "./pages/chatroom/chatroom.tsx";
import WaitRoom from "./pages/waitroom/waitroom.tsx";
import { io } from "socket.io-client";

// 웹소켓 연결 및 소켓 인스턴스 생성
export const socket = io("http://localhost:4000/chat");

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WaitRoom />} />
      <Route path="/room/:roomName" element={<Chatroom />} />
    </Routes>
  );
};

export default App;
