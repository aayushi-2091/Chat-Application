import create from "zustand";

const useSelectedUserStore = create((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));

export default useSelectedUserStore;
