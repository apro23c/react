import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. persist 미들웨어 불러오기

// 2. 기존 로직을 persist()로 한 번 감싸주기만 하면 끝입니다!
const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage', // 브라우저 로컬 스토리지에 저장될 고유한 이름
    }
  )
);

export default useThemeStore;