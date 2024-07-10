import React, { useEffect, useState } from "react";
import AddUser from "./addUser/AddUser";
import useChatStore from "../../useChatStore";
import useOpenChatList from "../../useOpenChatList";
import useSelectedUserStore from "../../useSelectedUserStore";
import "./chatList.css";

const ChatList = () => {
  const [selected, setSelected] = useState(0);
  const [addMode, setAddMode] = useState(false);
  const [search, setSearch] = useState("");
  const { chats, addToChats } = useChatStore();
  const { openChatList, toggle } = useOpenChatList((state) => state);
  const { setSelectedUser } = useSelectedUserStore();

  useEffect(() => {
    const handleWidth = () => {
      if (window.innerWidth <= 1240 && !close) {
        toggle(false);
        setClose(true);
      } else if (window.innerWidth > 1240) {
        toggle(true);
        setClose(false);
      }
    };

    window.addEventListener("resize", handleWidth);

    return () => {
      window.removeEventListener("resize", handleWidth);
    };
  }, [close, toggle]);

  const handleSelect = (user) => {
    setSelected(user.id);
    setSelectedUser(user);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAddMode = () => {
    setSearch("");
    setAddMode((prev) => !prev);
  };

  const handleAddToChats = (user) => {
    addToChats(user);
    setAddMode(false);
  };

  const filtered = chats.filter((user) =>
    user.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="chatList" style={{ display: openChatList ? "block" : "none" }}>
      <div className="searchBar">
        <div className="search">
          <img src="./search.svg" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={handleSearch}
            value={search}
          />
        </div>
        <svg
          fill={addMode ? "#2a2c4270" : "#2a2c42c3"}
          width="30px"
          height="30px"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleAddMode}
        >
          <title>plus-user</title>
          <path d="M2.016 28q0 0.832 0.576 1.44t1.408 0.576h14.016v-0.352q-1.792-0.608-2.912-2.176t-1.088-3.488q0-2.016 1.184-3.584t3.072-2.112q0.384-1.216 1.216-2.176t2.016-1.504q0.512-1.376 0.512-2.624v-1.984q0-3.328-2.368-5.664t-5.632-2.336-5.664 2.336-2.336 5.664v1.984q0 2.112 1.024 3.904t2.784 2.912q-1.504 0.544-2.912 1.504t-2.496 2.144-1.76 2.624-0.64 2.912zM18.016 24q0 0.832 0.576 1.44t1.408 0.576h2.016v1.984q0 0.864 0.576 1.44t1.408 0.576 1.408-0.576 0.608-1.44v-1.984h1.984q0.832 0 1.408-0.576t0.608-1.44-0.608-1.408-1.408-0.576h-1.984v-2.016q0-0.832-0.608-1.408t-1.408-0.576-1.408 0.576-0.576 1.408v2.016h-2.016q-0.832 0-1.408 0.576t-0.576 1.408z"></path>
        </svg>
      </div>
      {!addMode && (
        <div className="list">
          {filtered.map((user) => (
            <div
              className={`userItem ${selected === user.id ? "float" : ""}`}
              key={user.id}
              onClick={() => handleSelect(user)}
            >
              <div className="user">
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {addMode && <AddUser search={search} handleAddToChats={handleAddToChats} />}
    </div>
  );
};

export default ChatList;
