import { create } from "zustand";

const useRegister = create((set) => ({
  wantToRegister: true,
  toggleRegister: () =>
    set((state) => ({ wantToRegister: !state.wantToRegister })),
}));


export default useRegister;