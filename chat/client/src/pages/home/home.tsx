import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Head, Table } from "./home.styles.tsx";
import { socket } from "../../App.tsx";

interface IUSER {
  name: string;
}

const Home = () => {
  const [users, setUsers] = useState<IUSER[]>([]);
  const navigate = useNavigate();
  const addUser = useCallback(() => {
    const name = prompt("Enter you name, please.");
    if (!name) return alert("You must enter your name.");

    socket.emit("create-user", name, (response: any) => {
      console.log(response);
      if (!response.success) return alert(response.payload);

      navigate("/wait", { state: { name } });
    });
  }, [navigate]);

  useEffect(() => {
    const setUsersHandler = (users: IUSER[]) => {
      console.log(users);
      setUsers([...users]);
    };
    socket.emit("init", setUsersHandler); // 해당 소켓에 데이터가 남아있으면 초기화하기 위함
    socket.on("users", setUsersHandler);

    return () => {
      socket.off("users", setUsersHandler);
      socket.off("init", setUsersHandler);
    };
  }, []);

  return (
    <div>
      <Head>
        <div>Welcome to chat ** service</div>
        <button onClick={addUser}>Set your name</button>
      </Head>
      {users.length === 0 ? <p> No current users</p> : <p>Current user list</p>}
      {users.length > 0 &&
        users.map((u) => {
          console.log(user);
          return <p key={u.name}>{u.name}</p>;
        })}
    </div>
  );
};

export default Home;
