import create from "zustand";

const useChatStore = create((set) => ({
  chats: JSON.parse(localStorage.getItem("chats")) || [],
  addToChats: (user) => {
    // Construct the full profile photo URL
    const fullProfilePhotoUrl = user.profile.profile_photo
      ? `http://127.0.0.1:8000/storage/${user.profile.profile_photo}`
      : `https://ui-avatars.com/api/?name=${user.name.charAt(0)}&background=random`;

    // Include the full profile photo URL in the user object
    const userWithPhoto = { ...user, profilePhotoUrl: fullProfilePhotoUrl };

    set((state) => {
      const existingUser = state.chats.find((chatUser) => chatUser.id === user.id);
      if (existingUser) return state;

      const updatedChats = [...state.chats, userWithPhoto];
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return { chats: updatedChats };
    });
  },
}));

export default useChatStore;
