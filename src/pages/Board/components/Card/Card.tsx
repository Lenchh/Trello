import { JSX, useState } from 'react';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';

interface ICardProps {
  card: ICard;
  listId: number;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
  index: number;
}

export function Card({ card, listId, boardId, onRefresh, index }: ICardProps): JSX.Element {
  const [isNameCard, setIsNameCard] = useState(true);
  const [nameCard, setNameCard] = useState(card.title || 'Default name');

  function handleDragStart(e: React.DragEvent<HTMLLIElement>): void {
    e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget;
    e.dataTransfer.setData('cardId', String(card.id));
    e.dataTransfer.setData('sourceListId', String(listId));
    const slot = document.createElement('div');
    slot.classList.add(cardStyle.card);
    slot.classList.add(cardStyle.card__ghost);
    slot.textContent = card.title;
    document.body.appendChild(slot);
    e.dataTransfer.setDragImage(slot, slot.offsetWidth / 2, slot.offsetHeight / 2);
    setTimeout(() => {
      slot.remove();
      target.classList.add(cardStyle.card__dragging);
    }, 0);
  }

  function handleDragEnd(e: React.DragEvent<HTMLLIElement>): void {
    e.currentTarget.classList.remove(cardStyle.card__dragging);
  }
  return (
    <li
      className={cardStyle.card}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
