import classNames from "classnames";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../App.tsx";
import {
  ChatContainer,
  LeaveButton,
  Message,
  MessageBox,
  MessageForm,
} from "./chatroom.styles.tsx";

interface IChat {
  username: string;
  message: string;
  room: any;
}

const ChatRoom = () => {
  const [name, setName] = useState<string>("");
  const [chats, setChats] = useState<[]>([]);
  const [roomInfo, setRoomInfo] = useState<any>({});
  const [message, setMessage] = useState<string>("");
  const chatContainerEl = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { roomName } = useParams<"roomName">();
  const navigate = useNavigate();

  useEffect(() => {
    const { state } = location;
    console.log(state);
    if (!state || !state.name) {
      navigate("/");
    }
    setName(state.name);
  }, []);

  // 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
  useEffect(() => {
    if (!chatContainerEl.current) return;

    const chatContainer = chatContainerEl.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chats.length]);

  // message event listener
  useEffect(() => {
    const messageHandler = (chat) => {
      console.log(chat);
      if (chat.room) {
        setRoomInfo({ ...chat.room });
      }
      setChats((prevChats) => [...prevChats, chat]);
    };

    socket.on("message", messageHandler);

    return () => {
      socket.off("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    const setRoomsHandler = (room) => {
      console.log(room);
      if (room) {
        setRoomInfo({ ...room });
      } else {
        setRoomInfo({});
      }
    };

    socket.emit("room", { roomName }, setRoomsHandler);
    socket.on("room", { roomName }, setRoomsHandler);

    return () => {
      socket.off("room", { roomName }, setRoomsHandler);
    };
  }, [roomName]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const onSendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!message) return alert("메시지를 입력해 주세요.");

      socket.emit("message", { roomName, message }, (chat) => {
        setChats((prevChats) => [...prevChats, chat]);
        setMessage("");
      });
    },
    [message, roomName]
  );

  const onLeaveRoom = useCallback(() => {
    socket.emit("leave-room", roomName, () => {
      navigate("/");
    });
  }, [navigate, roomName]);

  useEffect(() => {
    console.log(chats);
  }, [chats]);

  return (
    <>
      <h1>Room creater: {roomInfo?.creater?.name}</h1>
      <h1>Chat Room: {roomInfo?.name}</h1>
      <h3>Chat Member count: {roomInfo?.users?.length}</h3>
      <LeaveButton onClick={onLeaveRoom}>방 나가기</LeaveButton>
      <ChatContainer ref={chatContainerEl}>
        {chats.map((chat, index) => (
          <MessageBox
            key={index}
            className={classNames({
              my_message: name === chat.user?.name,
              alarm: !chat.user,
            })}
          >
            <span>
              {chat.user?.name
                ? name === chat.user.name
                  ? ""
                  : chat.user.name
                : ""}
            </span>
            <Message className="message">{chat.message}</Message>
          </MessageBox>
        ))}
      </ChatContainer>
      <MessageForm onSubmit={onSendMessage}>
        <input type="text" onChange={onChange} value={message} />
        <button>보내기</button>
      </MessageForm>
    </>
  );
};

export default ChatRoom;
