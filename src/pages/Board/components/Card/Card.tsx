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

  // function handleDragStart(e: React.DragEvent<HTMLLIElement>): void {
  //   e.dataTransfer.effectAllowed = 'move';
  //   const target = e.currentTarget;
  //   e.dataTransfer.setData('cardId', String(card.id));
  //   e.dataTransfer.setData('sourceListId', String(listId));
  //   e.dataTransfer.setData('cardTitle', String(card.title));
  //   setDraggingCardTitle(card.title);
  //   const slot = document.createElement('div');
  //   slot.classList.add(cardStyle.card);
  //   slot.classList.add(cardStyle.card__ghost);
  //   slot.textContent = card.title;
  //   document.body.appendChild(slot);
  //   e.dataTransfer.setDragImage(slot, slot.offsetWidth / 2, slot.offsetHeight / 2);
  //   setTimeout(() => {
  //     slot.remove();
  //     target.classList.add(cardStyle.card__dragging);
  //   }, 0);
  // }

  // function handleDragEnd(e: React.DragEvent<HTMLLIElement>): void {
  //   e.currentTarget.classList.remove(cardStyle.card__dragging);
  // }
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
