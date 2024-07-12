import { useEffect, useState } from "react";
import ChatList from "../chatList/ChatList";
import "./chatContainer.css";
import { MdChat } from "react-icons/md";
import { MdGroup } from "react-icons/md";
import Chat from "../chat/Chat";
import axios from "axios";

export default function ChatContainer() {
    const [currentUser, setCurrentUser] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCurrentUser(userResponse.data);

                const profileResponse = await axios.get('http://127.0.0.1:8000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { profile } = profileResponse.data;

                if (profile.profile_photo) {
                    setProfilePhoto(`http://127.0.0.1:8000/storage/${profile.profile_photo}`);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const getAvatarUrl = (name, profilePhoto) => {
        if (profilePhoto) {
            return profilePhoto;
        }
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
                        <img src={getAvatarUrl(currentUser.name, profilePhoto)} alt="Avatar" />
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
