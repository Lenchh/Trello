import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard } from '../../common/interfaces/ICard';

interface modalState {
  isOpen: boolean;
  card: ICard | null;
}

const initialState: modalState = {
  isOpen: false,
  card: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ICard>) => {
      state.isOpen = true;
      state.card = action.payload;
    },

    closeModal: (state) => {
      state.isOpen = false;
      state.card = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
