import { ChangeEvent, JSX } from 'react';
import { useParams } from 'react-router-dom';
import cardStyle from './card.module.scss';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';
import { useAppDispatch } from '../../../../featchers/hooks';
import { editCard } from '../../../../featchers/slices/boardSlice';

interface props {
  listId: number | undefined;
  cardId: number | undefined;
  setIsNameCard: React.Dispatch<React.SetStateAction<boolean>>;
  nameCard: string;
  setNameCard: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string | undefined;
  infoCard: string;
}

export function EditNameCard({
  cardId,
  listId,
  setIsNameCard,
  nameCard,
  setNameCard,
  oldValue,
  infoCard,
}: props): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();

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
      if (boardId && cardId && listId)
        await dispatch(editCard({ boardId, cardId, listId, nameCard, infoCard })).unwrap();
    } catch (error) {
      setNameCard(oldValue!);
    } finally {
      setIsNameCard(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter') {
      editName();
    }
  };

  return (
    <textarea
      placeholder={infoCard === 'description' ? 'Тут може бути опис карточки, який підтримує markdown...' : ' '}
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
