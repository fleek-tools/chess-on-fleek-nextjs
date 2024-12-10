import { create } from "zustand";

type Theme = {
  darkSquareStyle: React.CSSProperties;
  lightSquareStyle: React.CSSProperties;
};

type BoardStore = {
  theme: Theme;
  moves: String[];
  gameResult: string | null;
  currentFEN: string;
  userName: string;
  profilePhoto: string;
  gameOver: boolean;
  gameTimer: number;
  isTimerRunning: boolean;
  onNewGame: () => void;
  setTheme: (theme: Theme) => void;
  setMoves: (moves: String[]) => void;
  setGameResult: (result: string | null) => void;
  setOnNewGame: (onNewGame: () => void) => void;
  setCurrentFEN: (fen: string) => void;
  setUserName: (name: string) => void;
  setProfilePhoto: (photo: string) => void;
  setGameOver: (gameOver: boolean) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  incrementTimer: () => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  theme: {
    darkSquareStyle: { backgroundColor: "#779952" },
    lightSquareStyle: { backgroundColor: "#edeed1" },
  },
  moves: [],
  gameResult: null,
  currentFEN: "",
  userName: "User",
  profilePhoto: "/images/def_user.jpeg",
  gameOver: false,
  gameTimer: 0,
  isTimerRunning: false,

  onNewGame: () => {},
  setTheme: (theme) => set({ theme }),
  setMoves: (moves) => set({ moves }),
  setGameResult: (result) => set({ gameResult: result }),
  setOnNewGame: (onNewGame) => set({ onNewGame }),
  setCurrentFEN: (fen) => set({ currentFEN: fen }),
  setUserName: (name) => set({ userName: name }),
  setProfilePhoto: (photo) => set({ profilePhoto: photo }),
  setGameOver: (gameOver) => set({ gameOver }),

  startTimer: () => set({ isTimerRunning: true }),
  stopTimer: () => set({ isTimerRunning: false }),
  resetTimer: () => set({ gameTimer: 0, isTimerRunning: false }),
  incrementTimer: () => set((state) => ({ gameTimer: state.gameTimer + 1 })),
}));
