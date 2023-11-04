import { React, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bytes.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login";
    const { data } = await axios.post(`http://localhost:5000/api/${url}`, {
      username,
      password,
    });
    setLoggedInUsername(username);
    setId(data.id);
    navigate("/");
  }

  return (
    <div>
      <div className="min-h-screen bg-indigo-50 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-4 italic font-thin text-4xl">bytes</div>
          <div className="bg-indigo-100 pt-2 pb-8 px-10 rounded-2xl shadow-2xl z-20 border-4 border-slate-700 ">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center">
                <img src={logo} className="w-20" />
              </div>
              <h1 className="text-3xl font-bold text-center mb-4">
                Create An Account
              </h1>
              <div className="space-y-4">
                <input
                  type="text"
                  value={username}
                  placeholder="username"
                  className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-center mt-6">
                <button className="py-3 w-64 text-xl text-white bg-indigo-500 rounded-2xl border-2 border-slate-700">
                  {isLoginOrRegister === "register" ? "Register" : "Login"}
                </button>
                <p className="mt-4 text-sm">
                  {isLoginOrRegister === "register" && (
                    <div className="flex justify-between">
                      Already a member?
                      <button
                        className="mr-1 italic text-indigo-500"
                        onClick={() => setIsLoginOrRegister("login")}
                      >
                        login
                      </button>
                    </div>
                  )}
                  {isLoginOrRegister === "login" && (
                    <div className="flex justify-between">
                      Dont have an account?
                      <button
                        className="mr-1 italic text-indigo-500"
                        onClick={() => setIsLoginOrRegister("register")}
                      >
                        register
                      </button>
                    </div>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
