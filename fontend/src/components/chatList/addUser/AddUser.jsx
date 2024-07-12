import { useEffect, useState } from "react";
import "./addUser.css";
import axios from "axios";
import useChatStore from "../../../useChatStore";

const AddUser = ({ search, handleAddToChats }) => {
  const { chats, addToChats } = useChatStore();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUserProfilePhoto, setSelectedUserProfilePhoto] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://127.0.0.1:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('API Response:', response.data);

        // Ensure response.data is an array of users
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Response data is not an array');
        }

        setUsers(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const getProfilePhotoUrl = (user) => {
    if (user.profile.profile_photo === null) {
      const initial = user.name.charAt(0);
      return `https://ui-avatars.com/api/?name=${initial}&background=random`;
    } else {
      return `http://127.0.0.1:8000/storage/${user.profile.profile_photo}`;
    }
  };

  const handleAdd = (user) => {
    addToChats(user);
    handleAddToChats(user);
    setSelectedUserProfilePhoto(getProfilePhotoUrl(user));
    console.log(getProfilePhotoUrl(user));
  };

  const filtered = users.filter(
    (user) =>
      !chats.find((chatUser) => chatUser.id === user.id) &&
      user.name.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="addUser">
      {filtered.map((user) => (
        <div className="userItem" key={user.id}>
          <div className="user">
            <img src={getProfilePhotoUrl(user)} alt="" />
            <span>{user.name}</span>
          </div>
          <button onClick={() => handleAdd(user)}>
            Add User
          </button>
        </div>
      ))}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default AddUser;
