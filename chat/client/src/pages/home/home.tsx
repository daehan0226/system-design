import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Head, Table } from "./home.styles.tsx";
import { socket } from "../../App.tsx";

const Home = () => {
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
  return (
    <>
      <Head>
        <div>Welcome to chat ** service</div>
        <button onClick={addUser}>Set your name</button>
      </Head>
    </>
  );
};

export default Home;
