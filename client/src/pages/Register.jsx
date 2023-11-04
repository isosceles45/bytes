import { React, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/bytes.png";
import { Link } from "react-router-dom";
import logoText from "../assets/bytes_text.png";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    const { data } = await axios.post("http://localhost:5000/api/register", {
      username,
      password,
    });
    setLoggedInUsername(username);
    setId(data.id);
    navigate("/signin")
  }

  return (
    <div>
      <div className="min-h-screen bg-green-400 flex justify-center items-center">
        <div className="absolute w-60 h-60 rounded-xl bg-green-300 -top-5 -left-16 z-0 transform rotate-45 hidden md:block shadow-2xl"></div>
        <div className="absolute w-48 h-48 rounded-xl bg-green-300 bottom-6 right-10 transform rotate-12 hidden md:block shadow-2xl"></div>
        <div className="flex flex-col justify-center items-center">
          <img src={logoText} className="w-64" />
          <div className="bg-white pt-2 pb-8 px-10 rounded-2xl shadow-2xl z-20 border-4 border-slate-700 ">
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
                <button className="py-3 w-64 text-xl text-white bg-green-400 rounded-2xl border-2 border-slate-700">
                  Create Account
                </button>
                <p className="mt-4 text-sm flex justify-between">
                  Already Have An Account?{" "}
                  <Link to="/signin" className="underline cursor-pointer">
                    <span className="underline cursor-pointer text-blue-600">
                      Sign In
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="w-40 h-40 absolute bg-green-300 rounded-full top-4 right-12 hidden md:block shadow-2xl"></div>
      <div className="w-28 h-56 absolute bg-green-300 rounded-full bottom-6 left-12 transform rotate-45 hidden md:block shadow-2xl"></div>
    </div>
  );
};

export default Register;
