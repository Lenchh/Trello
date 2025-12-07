import { JSX, useState } from 'react';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';
import { handleDragEnd, handleDragStart } from '../../../../common/d-n-d/DragAndDrop';

interface ICardProps {
  card: ICard;
  listId: number;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
  index: number;
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export function Card({ card, listId, boardId, onRefresh, index, setPlaceholderIndex }: ICardProps): JSX.Element {
  const [isNameCard, setIsNameCard] = useState(true);
  const [nameCard, setNameCard] = useState(card.title || 'Default name');

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
        <div className={cardStyle.card__textCard} onClick={(): void => setIsNameCard(false)}>
          {nameCard}
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
        />
      )}
    </li>
  );
}
