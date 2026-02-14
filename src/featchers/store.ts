import { configureStore } from '@reduxjs/toolkit';
import modalReducer from './slices/modalSlice';
import boardReducer from './slices/boardSlice';

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    board: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
