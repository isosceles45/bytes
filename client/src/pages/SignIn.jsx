import { React, useState, useContext } from "react";
import logo from "../assets/bytes.png";
import { Link } from "react-router-dom";
import logoText from "../assets/bytes_text.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

export const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    const { data } = await axios.post("http://localhost:5000/api/login", {
      username,
      password,
    });
    setLoggedInUsername(username);
    setId(data.id);
    navigate("/");
  }

  return (
    <div>
      <div className="min-h-screen bg-purple-400 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-purple-300 -top-5 -left-16 z-0 transform rotate-45 hidden md:block shadow-2xl"></div>
        <div className="absolute w-48 h-48 rounded-xl bg-purple-300 bottom-6 right-10 transform rotate-12 hidden md:block shadow-2xl"></div>
        <div className="flex flex-col justify-center items-center">
          <img src={logoText} className="w-64" />
          <div className="bg-white pt-2 pb-8 px-10 rounded-2xl shadow-2xl z-20 border-4 border-slate-700">
            <form onSubmit={handleSubmit}>
              <div>
                <div className="flex justify-center">
                  <img src={logo} className="w-20" />
                </div>
                <h1 className="text-3xl font-bold text-center mb-4">Sign In</h1>
              </div>
              <div className="space-y-4">
                <input
                  type="username"
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
                <button className="py-3 w-64 text-xl text-white bg-purple-400 rounded-2xl border-2 border-slate-700">
                  Sign In
                </button>
                <p className="mt-4 text-sm flex justify-between">
                  Dont Have An Account?{" "}
                  <Link to="/register" className="underline cursor-pointer">
                    <span className="underline cursor-pointer text-blue-600">
                      Register
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="w-40 h-40 absolute bg-purple-300 rounded-full top-4 right-12 hidden md:block shadow-2xl"></div>
      <div className="w-28 h-56 absolute bg-purple-300 rounded-full bottom-6 left-12 transform rotate-45 hidden md:block shadow-2xl"></div>
    </div>
  );
};

export default SignIn;
