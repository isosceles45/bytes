import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import logo from "../assets/bytes.png";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSend } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import Avatar from "../components/Avatar.jsx";

const Home = () => {
  const { username, id } = useContext(UserContext);
  const [onlinePeople, setOnlinePeople] = useState({});

  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function handleMessage(ev) {
    const message = JSON.parse(ev.data);
    if ("online" in message) {
      showOnlinePeople(message.online);
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }
  console.log(onlinePeople);

  return (
    <div>
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col pt-4 pl-6 pr-2 w-64  flex-shrink-0 bg-white">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <img src={logo} className="w-16" />
              <div className="ml-2 italic font-thin text-2xl">bytes</div>
            </div>
            <div className="h-full bg-white flex flex-col justify-between">
            <div className="flex flex-col justify-between mt-6 bg-white">
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold text-base">Conversations</span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-96 overflow-y-auto">
                {Object.keys(onlinePeople).map((userId) => (
                  <button
                    className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                    key={userId}
                  >
                    <Avatar userId={userId} username={onlinePeople[userId]} />
                    <div className="ml-2 text-sm font-semibold">
                      {onlinePeople[userId]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col py-6 bg-white">
              <div className="flex flex-row items-center bg-indigo-100 border border-gray-200 w-full py-1 px-4 rounded-lg">
                <div className="w-10 mr-6 rounded-full border overflow-hidden">
                  <img
                    src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                    alt="Avatar"
                  />
                </div>
                <div className="text-base font-semibold">{username}</div>
              </div>
              <button className="flex flex-row mt-3 items-center bg-indigo-100 border border-gray-200 w-full py-2 px-4 rounded-lg">
                <div className="w-12 mx-2 rounded-full border overflow-hidden">
                  <FiLogOut size={25} />
                </div>
                <div className="text-base font-semibold">Logout</div>
              </button>
            </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    <div className="col-start-1 col-end-8 p-3 rounded-lg">
                      <div className="flex flex-row items-center">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          A
                        </div>
                        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                          <div>Hey How are you today?</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-start-6 col-end-13 p-3 rounded-lg">
                      <div className="flex items-center justify-start flex-row-reverse">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          A
                        </div>
                        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                          <div>I'm ok what about you?</div>
                          <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                            Seen
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-start-1 col-end-8 p-3 rounded-lg">
                      <div className="flex flex-row items-center"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div>
                  <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <GrAttachment size={20} />
                  </button>
                </div>
                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      type="text"
                      className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <button className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                    <span>Send</span>
                    <span className="ml-2">
                      <AiOutlineSend size={14} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
