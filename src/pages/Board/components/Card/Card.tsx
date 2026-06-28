import React, { JSX, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';
import { handleDragEnd, handleDragStart } from '../../../../common/d-n-d/DragAndDrop';
import { useAppDispatch } from '../../../../featchers/hooks';
import { openModal } from '../../../../featchers/slices/modalSlice';
import { IList } from '../../../../common/interfaces/IList';
import { deleteCard, updatePosCards, editCard } from '../../../../featchers/slices/boardSlice';

interface ICardProps {
  card: ICard;
  index: number;
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>;
  currentList: IList;
}

export function Card({ card, index, setPlaceholderIndex, currentList }: ICardProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();

  const [isNameCard, setIsNameCard] = useState(true);
  const [isCompleted, setIsCompleted] = useState(card.title.includes('|DONE|'));
  const cleanTitle = card.title.replace('|DONE|', '').trim();
  const [nameCard, setNameCard] = useState(cleanTitle || 'Default name');

  const cardClass = isCompleted
    ? `${cardStyle.actionButton} ${cardStyle.checkFilled}`
    : `${cardStyle.actionButton} ${cardStyle.checkEmpty}`;

  const toggleComplete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    setIsCompleted(!isCompleted);
    const newTitleForServer = isCompleted ? cleanTitle : `${cleanTitle}|DONE|`;
    try {
      if (boardId)
        await dispatch(
          editCard({ boardId, cardId: card.id, listId: currentList.id, nameCard: newTitleForServer, infoCard: 'title' })
        ).unwrap();
    } catch (error) {
      setIsCompleted(card.title.includes('|DONE|'));
    }
  };

  useEffect(() => {
    setNameCard(card.title.replace('|DONE|', '').trim());
    setIsCompleted(card.title.includes('|DONE|'));
  }, [card.title]);

  const cardForModal: ICard = {
    ...card,
    listTitle: currentList.title,
    idList: currentList.id,
  };
  const handleClick = (): void => {
    dispatch(openModal(cardForModal));
  };

  const deleteCardData = async (): Promise<void> => {
    try {
      const cardId = card.id;
      if (boardId) await dispatch(deleteCard({ boardId, cardId })).unwrap();
      const cardsOldPositions = [...currentList.cards];
      const oldPosCards = cardsOldPositions
        ?.filter((c) => c.id !== cardId)
        .map((c, i) => ({
          id: c.id,
          position: i + 1,
          list_id: currentList.id,
        }));
      if (boardId) await dispatch(updatePosCards({ boardId, oldPosCards })).unwrap();
    } catch (error) {
      console.log('error with deletion card.');
    }
  };

  return (
    <li
      className={cardStyle.card}
      draggable="true"
      onDragStart={(e): void => handleDragStart(e, card, currentList.id, index, setPlaceholderIndex)}
      onDragEnd={(e): void => handleDragEnd(e)}
      data-id={card.id}
      data-list-id={currentList.id}
      data-index={index}
    >
      {}
      {isNameCard && card.title ? (
        <div className={cardStyle.textCard}>
          <button className={cardClass} onClick={toggleComplete}>
            {' '}
          </button>
          <p onClick={handleClick} className={isCompleted ? cardStyle.taskCompleted : undefined}>
            {nameCard}
          </p>
          <div className={cardStyle.containerButton}>
            <button
              className={cardStyle.actionButton}
              onClick={(e): void => {
                e.preventDefault();
                e.stopPropagation();
                setIsNameCard(false);
              }}
            >
              {' '}
            </button>
            <button
              className={`${cardStyle.actionButton} ${cardStyle.deleteButton}`}
              onClick={(e): void => {
                e.preventDefault();
                e.stopPropagation();
                deleteCardData();
              }}
            >
              {' '}
            </button>
          </div>
        </div>
      ) : (
        <EditNameCard
          listId={currentList.id}
          cardId={card.id}
          setIsNameCard={setIsNameCard}
          nameCard={nameCard}
          setNameCard={setNameCard}
          oldValue={cleanTitle}
          infoCard="title"
          isCompleted={isCompleted}
        />
      )}
    </li>
  );
}
