import { ChangeEvent, JSX, useState } from 'react';
import instance from '../../../../api/request';
import editBoardName from './editBoardName.module.scss';

interface props {
  onRefresh: () => Promise<void>;
  idBoard: string | undefined;
  setInput: React.Dispatch<React.SetStateAction<boolean>>;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
  nameBoard: string;
  setNameBoard: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string;
}

export function EditBoardName({
  onRefresh,
  idBoard,
  setInput,
  setInputError,
  nameBoard,
  setNameBoard,
  oldValue,
}: props): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setNameBoard(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (nameBoard.trim() === '') {
      setInputError('Ім`я дошки не повинно бути пустим.');
      return;
    }
    try {
      await instance.put(`/board/${idBoard}`, { title: nameBoard });
      onRefresh();
      setInput(false);
      setInputError('');
    } catch (error) {
      setInput(false);
      setInputError('Помилка при спробі зміни назви дошки.');
      setNameBoard(oldValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      editName();
    }
  };

  return (
    <input
      type="text"
      value={nameBoard}
      onChange={handleChange}
      className={editBoardName.input}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
