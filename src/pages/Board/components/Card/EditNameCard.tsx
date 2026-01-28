import { ChangeEvent, JSX } from 'react';
import instance from '../../../../api/request';
import cardStyle from './card.module.scss';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';

interface props {
  idList: number | undefined;
  idBoard: string | undefined;
  idCard: number | undefined;
  onRefresh: () => Promise<void>;
  setIsNameCard: React.Dispatch<React.SetStateAction<boolean>>;
  nameCard: string;
  setNameCard: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string | undefined;
  infoCard: string;
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
  infoCard,
}: props): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    if (infoCard === 'description') {
      setNameCard(event.target.value);
    } else if (infoCard === 'title' && /^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setNameCard(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (nameCard.trim() === '' && infoCard === 'title') {
      toastrInfo("Ім'я картки не повинно бути пустим", 'Інформація');
      return;
    }
    if (nameCard.trim() === oldValue?.trim()) {
      setIsNameCard(true);
      return;
    }
    try {
      if (infoCard === 'description') {
        await instance.put(`/board/${idBoard}/card/${idCard}`, { description: nameCard, list_id: idList });
      } else if (infoCard === 'title') {
        await instance.put(`/board/${idBoard}/card/${idCard}`, { title: nameCard, list_id: idList });
      }
      onRefresh();
      setIsNameCard(true);
      toastrSuccess('Дані збережено', 'Успіх');
    } catch (error) {
      setIsNameCard(true);
      setNameCard(oldValue!);
      toastrError('Помилка при спробі змінити дані', 'Помилка');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter') {
      editName();
    }
  };

  return (
    <textarea
      placeholder={infoCard === 'description' ? 'Тут може бути опис карточки...' : ' '}
      value={nameCard}
      className={cardStyle.card__input}
      onChange={handleChange}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      onClick={(e): void => {
        e.preventDefault();
        e.stopPropagation();
      }}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
