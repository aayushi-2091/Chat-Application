import create from "zustand";

const useChatStore = create((set) => ({
  chats: JSON.parse(localStorage.getItem("chats")) || [],
  addToChats: (user) =>
    set((state) => {
      // Prevent adding duplicates
      const existingUser = state.chats.find((chatUser) => chatUser.id === user.id);
      if (existingUser) return state;

      const updatedChats = [...state.chats, user];
      localStorage.setItem("chats", JSON.stringify(updatedChats));
      return { chats: updatedChats };
    }),
}));

export default useChatStore;
