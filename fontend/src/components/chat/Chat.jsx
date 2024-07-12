import "bootstrap/dist/css/bootstrap.min.css";
import "./chat.css";
import { TbPhoneCall } from "react-icons/tb";
import { MdVideoCall } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { MdAttachFile } from "react-icons/md";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { IoSend } from "react-icons/io5";
import { useState, useEffect } from "react";
import useOpenChatList from "../../useOpenChatList";
import useSelectedUserStore from "../../useSelectedUserStore";
import axios from "axios";
import Pusher from "pusher-js";
import { useNavigate } from "react-router-dom";
import { ChromePicker } from "react-color";
import Modal from 'react-modal';

const Chat = () => {
  const { openChatList, toggle } = useOpenChatList();
  const { selectedUser } = useSelectedUserStore();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [openEmoji, setEmoji] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState("text");
  const [mediaUrl, setMediaUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [background, setBackground] = useState("#ffffff"); // Default background color
  const [selectedUserProfilePhoto, setSelectedUserProfilePhoto] = useState("");

  const baseURL = "http://localhost:8000"; // Adjust this based on your backend URL

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCurrentUserId(response.data.id);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const token = localStorage.getItem("token");

      const fetchMessages = () => {
        axios
          .get(`http://127.0.0.1:8000/api/messages/${selectedUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setMessages(response.data);
          })
          .catch((error) => {
            console.error("Error fetching messages:", error);
          });
      };

      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000); // Poll every 1 second
      const fetchSelectedUserProfile = () => {
        axios
          .get(`http://127.0.0.1:8000/api/user-profile/${selectedUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const { profile,profilePhotoUrl, user } = response.data;
            const name = user.name;
            const initial = name ? name.charAt(0).toUpperCase() : '';
            
            if (profile.profile_photo==null) {
              setSelectedUserProfilePhoto(`https://ui-avatars.com/api/?name=${initial}&background=random`);
                
            } else {
              setSelectedUserProfilePhoto(`${profilePhotoUrl}`);
            }
        })
          .catch((error) => {
            console.error("Error fetching selected user's profile photo:", error);
          });
      };
      fetchSelectedUserProfile();


      const fetchBackgroundColor = () => {
        axios
          .get(`http://127.0.0.1:8000/api/chat-settings/${selectedUser.id}/background-color`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setBackground(response.data.background_color);
          })
          .catch((error) => {
            console.error("Error fetching background color:", error);
          });
      };

      fetchBackgroundColor();

      // Pusher.logToConsole = true;

      const pusher = new Pusher("daf186e3430736b05d17", {
        cluster: "mt1",
        forceTLS: true,
        authEndpoint: "http://127.0.0.1:8000/api/pusher/auth",
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      const channel = pusher.subscribe(`private-chat.${selectedUser.id}`);
      channel.bind("MessageSent", function (data) {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        clearInterval(intervalId);
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [selectedUser]);

  const handleOpenChatList = () => {
    toggle(!openChatList);
  };

  const sendMessage = () => {
    const token = localStorage.getItem("token");
    const payload = new FormData();

    payload.append("receiver_id", selectedUser.id);
    payload.append("type", messageType);

    if (messageType === "text" || messageType === "emoji") {
      payload.append("message", messageText);
    } else if (messageType === "image" || messageType === "video") {
      const fileInput = document.getElementById("file");
      if (fileInput.files.length > 0) {
        payload.append("media", fileInput.files[0]);
      }
    }
    setMessageText("");
    setMediaUrl("");
    setPreviewUrl("");
    setMessageType("text");
    axios
      .post("http://127.0.0.1:8000/api/messages", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMessages([...messages, response.data]);
        setMessageText("");
        setMediaUrl("");
        setPreviewUrl("");
        setMessageType("text"); // Reset to default message type
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const handleLogout = () => {
    navigate("/logout");
  };
  const handleProfile = () => {
    navigate("/profile");
  };
  const toggleDropdown = (event) => {
    event.stopPropagation();
    setShowDropdown((prevState) => !prevState);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setPreviewUrl(url);
    const fileType = file.type.split("/")[0];
    if (fileType === "image" || fileType === "video") {
      setMessageType(fileType);
      setMessageText(file.name);
    }
  };

  const handleChangeBackground = (color) => {
    setBackground(color.hex);

    const token = localStorage.getItem("token");
    axios
      .post(`http://127.0.0.1:8000/api/chat-settings/${selectedUser.id}/background-color`, {
        background_color: color.hex
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Background color updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating background color:", error);
      });
  };

  const openColorPicker = () => {
    setShowColorPicker(true);
  };

  const closeColorPicker = () => {
    setShowColorPicker(false);
  };

  return (
    <div className="chat">
      <Modal 
        isOpen={showColorPicker} 
        onRequestClose={closeColorPicker}
        style={{
          content: {
            top: '10%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -10%)',
            zIndex: '1000'
          }
        }}
        contentLabel="Change Background"
      >
        <ChromePicker color={background} onChangeComplete={handleChangeBackground} />
        <button onClick={closeColorPicker}>Close</button>
      </Modal>

      <div className="userInfo">
        <div className="user">
          <img
            className="menu"
            src={openChatList ? "./cross.png" : "./burger.png"}
            alt=""
            onClick={handleOpenChatList}
            style={{ left: openChatList ? "80%" : "0" }}
          />
          {selectedUser && (
            <>
            <img
                src={selectedUserProfilePhoto}
                className="profilephoto"
              />
              <div className="desc">
                <span>{selectedUser.name}</span>
              </div>
            </>
          )}
        </div>
        <div className="options">
          <TbPhoneCall className="option-icon" />
          <MdVideoCall className="option-icon" />
          <div className="dropdown">
            <IoMdMore className="option-icon dropdown-toggle" onClick={toggleDropdown} />
            {showDropdown && (
              <div className="dropdown-menu show">
                <div className="dropdown-item" onClick={openColorPicker}>
                  Change Background
                </div>
                <div className="dropdown-item" onClick={handleProfile}> Profile</div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="showMessage" style={{ backgroundColor: background }}>
        {messages.map((message, index) => {
          if (message.from_user_id === currentUserId) {
            return (
              <div key={index} className="message own">
                {(() => {
                  if (message.type === "text" || message.type === "emoji") {
                    return <p>{message.message}</p>;
                  } else if (message.type.startsWith("image/")) {
                    return (
                      <img src={`${baseURL}${message.media_url}`} alt="media" style={{
                        maxWidth: "100%",
                        height: "auto",
                        paddingLeft: "14rem", // Adjusted padding left
                      }}/>
                    );
                  } else if (message.type.startsWith("video/")) {
                    return (
                      <video controls>
                        <source
                          src={`${baseURL}${message.media_url}`}
                          type={message.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                })()}
              </div>
            );
          } else {
            return (
              <div key={index} className="message others">
                {(() => {
                  if (message.type === "text" || message.type === "emoji") {
                    return <p>{message.message}</p>;
                  } else if (message.type.startsWith("image/")) {
                    return (
                      <img src={`${baseURL}${message.media_url}`} alt="media" style={{
                        maxWidth: "100%",
                        height: "auto",
                        paddingRight: "14rem", // Adjusted padding left
                      }} />
                    );
                  } else if (message.type.startsWith("video/")) {
                    return (
                      <video controls>
                        <source
                          src={`${baseURL}${message.media_url}`}
                          type={message.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    );
                  }
                })()}
              </div>
            );
          }
        })}
      </div>
      <div className="typeMessage">
        <input
          id="file"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file">
          <MdAttachFile className="icons" title="Attach File" />
        </label>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            setMessageType("text");
          }}
        />
        <IoSend className="icons" onClick={sendMessage} />
        <div className="emoji">
          <BsEmojiSmileFill
            className="icons"
            title="Emoji"
            onClick={() => {
              setEmoji((prev) => !prev);
            }}
          />
          <EmojiPicker
            className="emojiPicker"
            open={openEmoji}
            onEmojiClick={(e) => {
              setMessageText((prev) => prev + e.emoji);
              setMessageType("emoji");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
