import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Language } from './components/LanguageSelector';

interface PollyGlotState {
  sourceLang: Language;
  targetLang: Language;
  input: string;
  aiTranslation: string;
  userGuess: string;
  score: number | null;
  loading: boolean;
  apiKey: string;
  ghKey: string;
  provider: 'OpenAI' | 'GitHub Models';
  error: string;
}

const initialState: PollyGlotState = {
  sourceLang: 'English',
  targetLang: 'French',
  input: '',
  aiTranslation: '',
  userGuess: '',
  score: null,
  loading: false,
  apiKey: '',
  ghKey: '',
  provider: 'OpenAI',
  error: '',
};

const pollyGlotSlice = createSlice({
  name: 'pollyglot',
  initialState,
  reducers: {
    setSourceLang(state, action: PayloadAction<Language>) {
      state.sourceLang = action.payload;
    },
    setTargetLang(state, action: PayloadAction<Language>) {
      state.targetLang = action.payload;
    },
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
    setAiTranslation(state, action: PayloadAction<string>) {
      state.aiTranslation = action.payload;
    },
    setUserGuess(state, action: PayloadAction<string>) {
      state.userGuess = action.payload;
    },
    setScore(state, action: PayloadAction<number | null>) {
      state.score = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload;
    },
    setGhKey(state, action: PayloadAction<string>) {
      state.ghKey = action.payload;
    },
    setProvider(state, action: PayloadAction<'OpenAI' | 'GitHub Models'>) {
      state.provider = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSourceLang,
  setTargetLang,
  setInput,
  setAiTranslation,
  setUserGuess,
  setScore,
  setLoading,
  setApiKey,
  setGhKey,
  setProvider,
  setError,
  reset,
} = pollyGlotSlice.actions;

export const store = configureStore({
  reducer: {
    pollyglot: pollyGlotSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
