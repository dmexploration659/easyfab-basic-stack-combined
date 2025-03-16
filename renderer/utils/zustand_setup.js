import { create } from "zustand";

export const useStore = create((set) => ({
    test: "test",
    setTest: (newTest) => set({ test: newTest }),
}));
