import { ChangeEvent, JSX, useState } from 'react';
import instance from '../../../../api/request';
import listStyle from './list.module.scss';

interface props {
  defaultTitle: string;
  boardId: string | undefined;
  idList: number;
  onCardCreated: () => Promise<void>;
  setNameList: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditNameList({ defaultTitle, boardId, idList, onCardCreated, setNameList }: props): JSX.Element {
  const [inputValue, setInputValue] = useState(defaultTitle || 'Default name');

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setInputValue(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (inputValue.trim() === '') {
      return;
    }
    try {
      await instance.put(`/board/${boardId}/list/${idList}`, { title: inputValue });
      onCardCreated();
      setNameList(true);
    } catch (error) {
      setNameList(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.trim()) {
      editName();
    }
  };

  return (
    <input
      type="text"
      value={inputValue}
      className={listStyle.list__input}
      onChange={handleChange}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
