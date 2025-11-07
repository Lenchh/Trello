import { ChangeEvent, JSX } from 'react';
import instance from '../../../../api/request';
import cardStyle from './card.module.scss';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';

interface props {
  idList: number;
  idBoard: string | undefined;
  idCard: number;
  onRefresh: () => Promise<void>;
  setIsNameCard: React.Dispatch<React.SetStateAction<boolean>>;
  nameCard: string;
  setNameCard: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string;
}

export function EditNameCard({
  idBoard,
  idCard,
  idList,
  onRefresh,
  setIsNameCard,
  nameCard,
  setNameCard,
  oldValue,
}: props): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setNameCard(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (nameCard.trim() === '') {
      toastrInfo("Ім'я картки не повинно бути пустим", 'Інформація');
      return;
    }
    try {
      await instance.put(`/board/${idBoard}/card/${idCard}`, { title: nameCard, list_id: idList });
      onRefresh();
      setIsNameCard(true);
      toastrSuccess('Дані збережено', 'Успіх');
    } catch (error) {
      setIsNameCard(true);
      setNameCard(oldValue);
      toastrError('Помилка при спробі змінити дані', 'Помилка');
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
      value={nameCard}
      className={cardStyle.card__input}
      onChange={handleChange}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
