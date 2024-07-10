import { useEffect, useState } from "react";
import ChatList from "../chatList/ChatList";
import "./chatContainer.css";
import { MdChat } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import Chat from "../chat/Chat";
import axios from "axios";

export default function ChatContainer() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get('http://127.0.0.1:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setCurrentUser(response.data);
            })
            .catch((error) => {
                console.error("Error fetching current user:", error);
            });
    }, []);

    const getAvatarUrl = (name) => {
        const initial = name ? name.charAt(0).toUpperCase() : '';
        return `https://ui-avatars.com/api/?name=${initial}&background=random`;
    }

    return (
        <div className="chatContainer">
            <div className="top">
                <ChatList />
                <Chat />
            </div>
            <div className="bottom">
                <div className="userName">
                    {currentUser && (
                        <img src={getAvatarUrl(currentUser.name)} alt="Avatar" />
                    )}
                    {currentUser && <span>{currentUser.name}</span>}
                </div>
                <div className="bottom-middle">
                    <div className="iconBg">
                        <MdChat className="icons" />
                    </div>
                    <div className="iconBg">
                        <MdGroup className="icons" />
                    </div>
                </div>
            </div>
        </div>
    );
}
