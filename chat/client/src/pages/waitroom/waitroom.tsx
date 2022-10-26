import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Head, Table } from "./waitroom.styles.tsx";
import { socket } from "../../App.tsx";

interface CreateRoomResponse {
  success: boolean;
  payload: string;
}

interface IRoom {
  creater: string;
  name: string;
  number: number;
  users: string[];
  maxUser?: number;
  password?: string;
  createdAt: Date;
}

const WaitRoom = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const setRoomsHandler = (rooms: IRoom[]) => {
      if (rooms && rooms.length > 0) {
        setRooms([...rooms]);
      } else {
        setRooms([]);
      }
    };

    // const setUsersHandler = (users: string[]) => {
    //   setUsers(users);
    // };

    // socket.on("users", setUsersHandler);
    socket.on("rooms", setRoomsHandler);
    socket.on("create-room", setRoomsHandler);
    socket.on("delete-room", setRoomsHandler);

    return () => {
      // socket.off("users", setUsersHandler);
      socket.off("rooms", setRoomsHandler);
      socket.off("create-room", setRoomsHandler);
      socket.off("delete-room", setRoomsHandler);
    };
  }, []);

  const onCreateRoom = useCallback(() => {
    const roomName = prompt("방 이름을 입력해 주세요.");
    if (!roomName) return alert("방 이름은 반드시 입력해야 합니다.");

    socket.emit("create-room", roomName, (response: CreateRoomResponse) => {
      if (!response.success) return alert(response.payload);

      navigate(`/room/${response.payload}`);
    });
  }, [navigate]);

  const onJoinRoom = useCallback(
    (roomName: string) => () => {
      socket.emit("join-room", roomName, () => {
        navigate(`/room/${roomName}`);
      });
    },
    [navigate]
  );

  return (
    <>
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
            console.log(room.name);
            console.log(room.creater);
            console.log(room.users);
            return (
              <tr key={room.name}>
                <td>{index + 1}</td>
                <td>{room.name}</td>
                <td>{room.creater}</td>
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
        <p>
          {users.map((user) => {
            return <span key={user}>{user}</span>;
          })}
        </p>
      </div>
    </>
  );
};

export default WaitRoom;
