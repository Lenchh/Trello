import { ChangeEvent, JSX, useState } from 'react';
import instance from '../../../../api/request';
import cardStyle from './card.module.scss';

interface props {
  defaultTitle: string;
  boardId: string | undefined;
  idCard: number;
  idList: number;
  onCardCreated: () => Promise<void>;
  setNameCard: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditNameCard({
  defaultTitle,
  boardId,
  idCard,
  idList,
  onCardCreated,
  setNameCard,
}: props): JSX.Element {
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
      await instance.put(`/board/${boardId}/card/${idCard}`, { title: inputValue, list_id: idList });
      onCardCreated();
      setNameCard(true);
    } catch (error) {
      setNameCard(true);
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
      className={cardStyle.card__input}
      onChange={handleChange}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
