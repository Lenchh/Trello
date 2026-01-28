import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICard } from '../../common/interfaces/ICard';
import { IList } from '../../common/interfaces/IList';

interface modalState {
  isOpen: boolean;
  card: ICard | null;
  lists: IList[] | null;
}

const initialState: modalState = {
  isOpen: false,
  card: null,
  lists: null,
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

    saveLists: (state, action: PayloadAction<IList[]>) => {
      state.lists = action.payload;
    },
  },
});

export const { openModal, closeModal, saveLists } = modalSlice.actions;
export default modalSlice.reducer;
