import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import logo from "../assets/bytes.png";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineSend } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import Avatar from "../components/Avatar.jsx";
import { uniqBy } from "lodash";
import axios from "axios";

const Home = () => {
  const { username, id } = useContext(UserContext);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);

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
    } else {
      setMessages((prev) => [...prev, { ...message }]);
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function sendMessage(ev) {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
      })
    );
    setNewMessageText("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessageText,
        sender: id,
        recipient: selectedUserId,
        id: Date.now(),
      },
    ]);
  }

  console.log(messages.sender, id);

  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`http://localhost:5000/api/messages/${selectedUserId}`)
        .then(({ data }) => {
          console.log(data);
        });
    }
  }, [selectedUserId]);

  const onlinePeopleExcludingCurrUser = { ...onlinePeople };
  delete onlinePeopleExcludingCurrUser[id];

  const messagesWithoutDupes = uniqBy(messages, "id");

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
                  {Object.keys(onlinePeopleExcludingCurrUser).map((userId) => (
                    <button
                      className={
                        `flex flex-row items-center hover:bg-gray-100 rounded-xl p-2` +
                        (userId === selectedUserId ? " bg-indigo-100" : "")
                      }
                      key={userId}
                      onClick={() => setSelectedUserId(userId)}
                    >
                      <Avatar
                        userId={userId}
                        username={onlinePeopleExcludingCurrUser[userId]}
                      />
                      <div className="ml-2 text-sm font-semibold">
                        {onlinePeople[userId]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col py-6 bg-white">
                <div className="flex justify-between items-center bg-indigo-100 border border-gray-200 w-full py-1 px-4 rounded-lg">
                  <div className="w-10 rounded-full border overflow-hidden">
                    <img
                      src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                      alt="Avatar"
                    />
                  </div>
                  <div className="text-base font-semibold">{username}</div>
                  <FiLogOut size={25} className="hover:cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  {!selectedUserId && (
                    <div className="text-gray-400 font-normal h-full flex flex-grow justify-center items-center">
                      &larr; Select a person to have conversation
                    </div>
                  )}
                  {!!selectedUserId && (
                    <div>
                      {messagesWithoutDupes.map((messages) => (
                        <div className="flex flex-col">
                          <div
                            className={
                              messages.sender === id
                                ? "flex justify-end items-center p-3 rounded-lg"
                                : "flex justify-start items-center p-3 rounded-lg"
                            }
                          >
                            <Avatar
                              userId={
                                messages.sender === id ? id : selectedUserId
                              }
                              username={
                                messages.sender === id
                                  ? username
                                  : onlinePeopleExcludingCurrUser[
                                      selectedUserId
                                    ]
                              }
                            />
                            <div
                              className={
                                messages.sender === id
                                  ? "relative ml-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                  : "relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                              }
                            >
                              <div>{messages.text}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* {!!selectedUserId && (
                      <div className="col-start-6 col-end-13 p-3 rounded-lg">
                        <div className="flex items-center justify-start flex-row-reverse">
                          <Avatar
                            userId={selectedUserId}
                            username={
                              onlinePeopleExcludingCurrUser[selectedUserId]
                            }
                          />
                          <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                            {messagesWithoutDupes.map((messages) => (
                              <div>{messages.text}</div>
                            ))}
                            <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                              Seen
                            </div>
                          </div>
                        </div>
                      </div>
                    )} */}
                </div>
              </div>
              {!!selectedUserId && (
                <form
                  className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                  onSubmit={sendMessage}
                >
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
                        placeholder="Message..."
                        value={newMessageText}
                        onChange={(ev) => setNewMessageText(ev.target.value)}
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                      type="submit"
                    >
                      <span>Send</span>
                      <span className="ml-2">
                        <AiOutlineSend size={14} />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
