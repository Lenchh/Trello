/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IBoard } from '../../common/interfaces/IBoard';
import instance from '../../api/request';
import { toastrSuccess } from '../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../common/toastr/error/toastr-options-error';

export const fetchBoard = createAsyncThunk<IBoard, string, { rejectValue: string }>(
  'board/fetchBoard',
  async (boardId, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/board/${boardId}`);
      return data;
    } catch (error: any) {
      toastrError(`Помилка при завантаженні даних.</br>Помилка: ${error}`, 'Помилка');
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBoard = createAsyncThunk<
  void,
  { inputValue: string; inputBackground: string },
  { rejectValue: string }
>('board/createBoard', async ({ inputValue, inputBackground }, { rejectWithValue }) => {
  try {
    await instance.post('/board', { id: Date.now(), title: inputValue, custom: { background: inputBackground } });
    toastrSuccess('Дошка успішно створена', 'Успіх');
  } catch (error: any) {
    toastrError(`Помилка при створенні дошки.</br>Помилка: ${error}`, 'Помилка');
    return rejectWithValue(error.response.data);
  }
});

export const deleteBoard = createAsyncThunk<void, string, { rejectValue: string }>(
  'board/deleteBoard',
  async (boardId, { rejectWithValue }) => {
    try {
      await instance.delete(`/board/${boardId}`);
      toastrSuccess('Дошку успішно видалено.', 'Успіх');
    } catch (error: any) {
      toastrError(`Помилка при видаленні дошки.</br>Помилка: ${error}`, 'Помилка');
      return rejectWithValue(error.response.data);
    }
  }
);

export const editTitleBoard = createAsyncThunk<void, { boardId: string; nameBoard: string }, { rejectValue: string }>(
  'board/editTitleBoard',
  async ({ boardId, nameBoard }, { dispatch, rejectWithValue }) => {
    try {
      await instance.put(`/board/${boardId}`, { title: nameBoard });
      dispatch(fetchBoard(boardId));
      toastrSuccess('Дані успішно змінені', 'Успіх');
    } catch (error: any) {
      toastrError(`Помилка при спробі змінити дані.</br>Помилка: ${error}`, 'Помилка');
      return rejectWithValue(error.response.data);
    }
  }
);

export const editBackgroundBoard = createAsyncThunk<
  void,
  { boardId: string; inputBackground: string },
  { rejectValue: string }
>('board/editBackgroundBoard', async ({ boardId, inputBackground }, { dispatch, rejectWithValue }) => {
  try {
    await instance.put(`/board/${boardId}`, { custom: { background: inputBackground } });
    dispatch(fetchBoard(boardId));
    toastrSuccess('Фон дошки успішно змінений', 'Успіх');
  } catch (error: any) {
    toastrError(`Помилка при спробі змінити фон дошки.</br>Помилка: ${error}`, 'Помилка');
    return rejectWithValue(error.response.data);
  }
});

export const createList = createAsyncThunk<void, string, { rejectValue: string }>(
  'board/createList',
  async (boardId, { dispatch, rejectWithValue }) => {
    try {
      await instance.post(`/board/${boardId}/list`, { title: '', cards: [], position: 1 });
      dispatch(fetchBoard(boardId));
    } catch (error: any) {
      toastrError(`Помилка при створенні списку.</br>Помилка: ${error}`, 'Помилка');
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteList = createAsyncThunk<void, { boardId: string; listId: number }, { rejectValue: string }>(
  'board/deleteList',
  async ({ boardId, listId }, { dispatch, rejectWithValue }) => {
    try {
      await instance.delete(`/board/${boardId}/list/${listId}`);
      dispatch(fetchBoard(boardId));
      toastrSuccess('Список успішно видалений', 'Успіх');
    } catch (error: any) {
      toastrError(`Помилка при видаленні списку.</br>Помилка: ${error}`, 'Помилка');
      return rejectWithValue(error.response.data);
    }
  }
);

export const editTitleList = createAsyncThunk<
  void,
  { boardId: string; listId: number; nameList: string },
  { rejectValue: string }
>('board/editTitleList', async ({ boardId, listId, nameList }, { dispatch, rejectWithValue }) => {
  try {
    await instance.put(`/board/${boardId}/list/${listId}`, { title: nameList });
    dispatch(fetchBoard(boardId));
    toastrSuccess('Дані збережено', 'Успіх');
  } catch (error: any) {
    toastrError(`Помилка при спробі змінити дані.</br>Помилка: ${error}`, 'Помилка');
    return rejectWithValue(error.response.data);
  }
});

export const createCard = createAsyncThunk<
  void,
  { boardId: string; listId: number; newPosition: number },
  { rejectValue: string }
>('board/createCard', async ({ boardId, listId, newPosition }, { dispatch, rejectWithValue }) => {
  try {
    await instance.post(`/board/${boardId}/card`, {
      title: '',
      list_id: listId,
      position: newPosition,
      description: '',
    });
    dispatch(fetchBoard(boardId));
  } catch (error: any) {
    toastrError(`Помилка при створенні картки.</br>Помилка: ${error}`, 'Помилка');
    return rejectWithValue(error.response.data);
  }
});

export const editCard = createAsyncThunk<
  void,
  { boardId: string; cardId: number; listId: number; nameCard: string; infoCard: string },
  { rejectValue: string }
>('board/editCard', async ({ boardId, cardId, listId, nameCard, infoCard }, { dispatch, rejectWithValue }) => {
  try {
    if (infoCard === 'description') {
      await instance.put(`/board/${boardId}/card/${cardId}`, { description: nameCard, list_id: listId });
    } else if (infoCard === 'title') {
      await instance.put(`/board/${boardId}/card/${cardId}`, { title: nameCard, list_id: listId });
    }
    dispatch(fetchBoard(boardId));
    toastrSuccess('Дані збережено', 'Успіх');
  } catch (error: any) {
    toastrError(`Помилка при спробі змінити дані.</br>Помилка: ${error}`, 'Помилка');
    return rejectWithValue(error.response.data);
  }
});

export const deleteCard = createAsyncThunk<void, { boardId: string; cardId: number }, { rejectValue: string }>(
  'board/deleteCard',
  async ({ boardId, cardId }, { dispatch, rejectWithValue }) => {
    try {
      await instance.delete(`/board/${boardId}/card/${cardId}`);
      dispatch(fetchBoard(boardId));
      toastrSuccess('Картка успішно видалена', 'Успіх');
    } catch (error: any) {
      toastrError(`Помилка при видаленні карточки.</br>Помилка: ${error}`, 'Помилка');
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePosCards = createAsyncThunk<
  void,
  { boardId: string; oldPosCards: { id: number; position: number; list_id: number }[] },
  { rejectValue: string }
>('board/updatePosCards', async ({ boardId, oldPosCards }, { dispatch, rejectWithValue }) => {
  try {
    await instance.put(`/board/${boardId}/card`, oldPosCards);
    dispatch(fetchBoard(boardId));
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

interface BoardState {
  isLoading: boolean;
  board: IBoard | null;
  error: any;
}

const initialState: BoardState = {
  isLoading: false,
  board: null,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    clearBoardData: (state) => {
      state.board = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.board = action.payload;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.board = null;
      });
  },
});

export const { clearBoardData } = boardSlice.actions;
export default boardSlice.reducer;
