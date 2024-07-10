import { useEffect, useState } from "react";
import "./addUser.css";
import axios from "axios";
import useChatStore from "../../../useChatStore";

const AddUser = ({ search, handleAddToChats }) => {
  const { chats, addToChats } = useChatStore();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

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

  const handleAdd = (user) => {
    addToChats(user);
    handleAddToChats(user);
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
            <img src={user.img} alt="" />
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
