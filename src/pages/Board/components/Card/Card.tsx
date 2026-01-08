import { JSX, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';
import { handleDragEnd, handleDragStart } from '../../../../common/d-n-d/DragAndDrop';
import { useAppDispatch } from '../../../../featchers/hooks';
import { openModal } from '../../../../featchers/slices/modalSlice';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';

interface ICardProps {
  card: ICard;
  listId: number;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
  index: number;
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>;
  listTitle: string;
}

export function Card({
  card,
  listId,
  boardId,
  onRefresh,
  index,
  setPlaceholderIndex,
  listTitle,
}: ICardProps): JSX.Element {
  const [isNameCard, setIsNameCard] = useState(true);
  const [nameCard, setNameCard] = useState(card.title || 'Default name');

  useEffect(() => {
    setNameCard(card.title);
  }, [card.title]);

  const dispatch = useAppDispatch();

  const cardForModal: ICard = {
    ...card,
    listTitle,
    idList: listId,
  };
  const handleClick = (): void => {
    dispatch(openModal(cardForModal));
  };

  return (
    <li
      className={cardStyle.card}
      draggable="true"
      onDragStart={(e): void => handleDragStart(e, card, listId, index, setPlaceholderIndex)}
      onDragEnd={(e): void => handleDragEnd(e)}
      data-id={card.id}
      data-list-id={listId}
      data-index={index}
    >
      {}
      {isNameCard && card.title ? (
        <div className={cardStyle.card__textCard}>
          <p onClick={handleClick}>{nameCard}</p>
          <button
            className={cardStyle.card__textCard__editButton}
            onClick={(e): void => {
              e.preventDefault();
              e.stopPropagation();
              setIsNameCard(false);
            }}
          >
            {' '}
          </button>
        </div>
      ) : (
        <EditNameCard
          idList={listId}
          idBoard={boardId}
          idCard={card.id}
          onRefresh={onRefresh}
          setIsNameCard={setIsNameCard}
          nameCard={nameCard}
          setNameCard={setNameCard}
          oldValue={card.title}
          infoCard="title"
        />
      )}
    </li>
  );
}
