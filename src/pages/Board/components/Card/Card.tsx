import { JSX, useState } from 'react';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';

interface ICardProps {
  card: ICard;
  listId: number;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
  isDragging: number | null;
  setIsDragging: React.Dispatch<React.SetStateAction<number | null>>;
}

export function Card({ card, listId, boardId, onRefresh, isDragging, setIsDragging }: ICardProps): JSX.Element {
  const [isNameCard, setIsNameCard] = useState(true);
  const [nameCard, setNameCard] = useState(card.title || 'Default name');
  const [isSlot, setSlot] = useState(false);
  // const [isDragging, setIsDragging] = useState(false);
  const thisIsDragging = isDragging === card.id;

  function handleDragStart(e: React.DragEvent<HTMLLIElement>): void {
    // e.dataTransfer.setData('text/plain', card.title);
    // e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget;
    target.classList.add(cardStyle.selected);
    const slot = document.createElement('div');
    slot.classList.add(cardStyle.card__ghost);
    slot.textContent = card.title;
    document.body.appendChild(slot);
    e.dataTransfer.setDragImage(slot, slot.offsetWidth / 2, slot.offsetHeight / 2);
    const greySlot = document.querySelector(`[data-id="${card.id}"].${cardStyle.card__greySlot}`);
    greySlot?.classList.remove(cardStyle.hidden);
    setTimeout(() => {
      document.body.removeChild(slot);
      setSlot(true);
      setIsDragging(card.id);
    }, 0);
  }

  function handleDragEnd(e: React.DragEvent<HTMLLIElement>): void {
    // eslint-disable-next-line no-console
    console.log('Что-то проверяем');
    const oldSlot = document.querySelector(`.${cardStyle.card__greySlot}:not(.${cardStyle.hidden})`);
    oldSlot?.classList.add(cardStyle.hidden);
    setIsDragging(null);
    setSlot(false);
  }
  return (
    <>
      <li
        className={`${cardStyle.card} ${thisIsDragging ? cardStyle.hidden : ''}`}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {isNameCard && card.title ? (
          <div className={cardStyle.card__textCard} onClick={(): void => setIsNameCard(false)} data-id={card.id}>
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
      {/* {isSlot && ( */}
      <div className={`${cardStyle.card__greySlot} ${cardStyle.hidden}`} data-id={card.id}>
        {nameCard}
      </div>
      {/* // )} */}
    </>
  );
}
