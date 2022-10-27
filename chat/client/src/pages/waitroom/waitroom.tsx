import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { Head, Table } from "./waitroom.styles.tsx";
import { socket } from "../../App.tsx";

interface CreateRoomResponse {
  success: boolean;
  payload: {
    name: string;
  };
}

interface IRoom {
  creater: {
    name: string;
  };
  name: string;
  number: number;
  users: any[];
  maxUser?: number;
  password?: string;
  createdAt: number;
}

const WaitRoom = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (!state || !state.name) {
      navigate("/");
    }
    console.log("?????", state);
    setName(state.name);
  }, []);

  useEffect(() => {
    const setRoomsHandler = (rooms: IRoom[]) => {
      console.log(rooms);
      if (rooms && rooms.length > 0) {
        setRooms([...rooms]);
      } else {
        setRooms([]);
      }
    };

    const setUsersHandler = (users: string[]) => {
      console.log(users);
      setUsers(users);
    };
    socket.emit("users", setUsersHandler);
    socket.on("users", setUsersHandler);
    socket.on("rooms", setRoomsHandler);
    socket.on("create-room", setRoomsHandler);
    socket.on("delete-room", setRoomsHandler);

    return () => {
      socket.off("rooms", setRoomsHandler);
      socket.off("users", setUsersHandler);
      socket.off("create-room", setRoomsHandler);
      socket.off("delete-room", setRoomsHandler);
    };
  }, []);

  const onCreateRoom = useCallback(() => {
    const roomName = prompt("방 이름을 입력해 주세요.");
    if (!roomName) return alert("방 이름은 반드시 입력해야 합니다.");

    socket.emit("create-room", roomName, (response: CreateRoomResponse) => {
      if (!response.success) return alert(response.payload);
      const { name: roomName } = response.payload;
      navigate(`/room/${roomName}`, { state: { name } });
    });
  }, [navigate]);

  const onJoinRoom = useCallback(
    (roomName: string) => () => {
      socket.emit("join-room", roomName, () => {
        navigate(`/room/${roomName}`, { state: { name } });
      });
    },
    [navigate]
  );

  return (
    <>
      <h1>Name: {name}</h1>
      <Head>
        <div>채팅방 목록</div>
        <button onClick={onCreateRoom}>채팅방 생성</button>
      </Head>

      <Table>
        <thead>
          <tr>
            <th>방번호</th>
            <th>방이름</th>
            <th>방장</th>
            <th>인원수</th>
            <th>생성 시간</th>
            <th>입장</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            console.log(room);
            return (
              <tr key={room.name}>
                <td>{index + 1}</td>
                <td>{room.name}</td>
                <td>{room.creater.name}</td>
                <td>{room.users?.length ?? 0}</td>
                <td>{room.createdAt}</td>
                <td>
                  <button onClick={onJoinRoom(room.name)}>입장하기</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div>
        <div>
          {users.map((user) => {
            return <p key={user.name}>{user.name}</p>;
          })}
        </div>
      </div>
    </>
  );
};

export default WaitRoom;
