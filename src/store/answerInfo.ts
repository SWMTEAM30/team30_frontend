import { create } from 'zustand';

interface AnswerInfoState {
  answers: Array<AnswerType>;
}

interface AnswerInfoActions {
  addAnswers: (answer: AnswerType) => void;
  reset: () => void;
}

const useAnswerInfo = create<AnswerInfoState & AnswerInfoActions>((set) => ({
  answers: [],
  addAnswers: (answer: AnswerType) => {
    set((store) => ({ answers: [...store.answers, answer] }));
  },
  reset: () => {
    set({ answers: [] });
  },
}));

export default useAnswerInfo;
