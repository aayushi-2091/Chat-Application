import { create } from "zustand";

const useOpenChatList = create((set) => ({
  openChatList: window.screen.width > 1240,
  toggle: (fl) => {
    set({ openChatList: fl });
  },
}));

export default useOpenChatList;
