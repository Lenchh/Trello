import { JSX, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';
import { handleDragEnd, handleDragStart } from '../../../../common/d-n-d/DragAndDrop';
import { useAppDispatch } from '../../../../featchers/hooks';
import { openModal } from '../../../../featchers/slices/modalSlice';
import { IList } from '../../../../common/interfaces/IList';
import { deleteCard, updatePosCards } from '../../../../featchers/slices/boardSlice';

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
  const [nameCard, setNameCard] = useState(card.title || 'Default name');

  useEffect(() => {
    setNameCard(card.title);
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
        <div className={cardStyle.card__textCard}>
          <p onClick={handleClick}>{nameCard}</p>
          <div className={cardStyle.card__textCard__containerButton}>
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
            <button
              className={`${cardStyle.card__textCard__editButton} ${cardStyle.card__textCard__deleteButton}`}
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
          oldValue={card.title}
          infoCard="title"
        />
      )}
    </li>
  );
}
