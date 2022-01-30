import React, { useState } from "react";
import Axios from "axios";

type Props = {
  setIsAdmin: any;
};

const API = window.location.protocol + "//" + window.location.host + "/admin";
// const API = "http://localhost:8080/admin";

export default function Login({ setIsAdmin }: Props) {
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    Axios.post(API, { password }).then((res) => {
      if (res.data === "Success") {
        setIsAdmin(true);
      } else {
        alert("Wrong password!");
        setPassword("");
      }
    });
  };

  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex justify-center text-3xl">
        <input
          type="password"
          className="h-16 p-2 text-right"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-center text-4xl font-bold">
        <div
          className="border-2 border-blue-500 p-4 rounded-md hover:text-green-800 cursor-pointer hover:border-yellow-400"
          onClick={handleLogin}
        >
          Login
        </div>
      </div>
    </div>
  );
}
