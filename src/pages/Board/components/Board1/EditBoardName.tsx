import { ChangeEvent, JSX, useState } from 'react';
import instance from '../../../../api/request';
import editBoardName from './editBoardName.module.scss';

interface props {
  defaultValue: string;
  onCardCreated: () => Promise<void>;
  idBoard: string | undefined;
  setInput: React.Dispatch<React.SetStateAction<boolean>>;
  setInputError: React.Dispatch<React.SetStateAction<string>>;
}

export function EditBoardName({ defaultValue, onCardCreated, idBoard, setInput, setInputError }: props): JSX.Element {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [errorInput, setErrorInput] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setInputValue(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (inputValue.trim() === '') {
      setInputError('Ім`я дошки не повинно бути пустим.');
      return;
    }
    try {
      await instance.put(`/board/${idBoard}`, { title: inputValue });
      onCardCreated();
      setInput(false);
      setInputError('');
    } catch (error) {
      setInput(false);
      setInputError('Помилка при спробі зміни назви дошки.');
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
      value={inputValue}
      onChange={handleChange}
      className={editBoardName.input}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
