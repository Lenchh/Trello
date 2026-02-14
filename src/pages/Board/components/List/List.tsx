import React, { JSX, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import { EditNameList } from './EditNameList';
import listStyle from './list.module.scss';
import cardStyle from '../Card/card.module.scss';
import { handleDragLeave, handleDragOver, handleDrop } from '../../../../common/d-n-d/DragAndDrop';
import { useAppDispatch } from '../../../../featchers/hooks';
import { createCard, deleteList } from '../../../../featchers/slices/boardSlice';

interface IListProps {
  list: IList;
  onRefresh: () => Promise<void>;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
}

export function List({ list, onRefresh, setLists }: IListProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const [isNameList, setIsNameList] = useState(true);
  const [nameList, setNameList] = useState(list.title || 'Default name');
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);

  const arrayCards = list.cards.map((card, index) => (
    <React.Fragment key={card.id}>
      {placeholderIndex === index && (
        <div className={cardStyle.card__greySlot} data-id={card.id}>
          {card.title}
        </div>
      )}
      <Link to={`/board/${boardId}/card/${card.id}`} key={card.id}>
        <Card card={card} key={card.id} index={index} setPlaceholderIndex={setPlaceholderIndex} currentList={list} />
      </Link>
    </React.Fragment>
  ));

  const handleCreateCard = (): void => {
    if (boardId) dispatch(createCard({ boardId, listId: list.id, newPosition: list.cards.length + 1 }));
  };

  const deleteListData = (): void => {
    if (boardId) dispatch(deleteList({ boardId, listId: list.id }));
  };

  return (
    <div className={listStyle.list}>
      {isNameList && list.title ? (
        <h2 className={listStyle.list__header} onClick={(): void => setIsNameList(false)}>
          {nameList}
        </h2>
      ) : (
        <EditNameList
          listId={list.id}
          setIsNameList={setIsNameList}
          nameList={nameList}
          setNameList={setNameList}
          oldValue={list.title}
        />
      )}
      <ul
        data-id={list.id}
        onDragOver={(e): void => handleDragOver(e, list, setPlaceholderIndex)}
        onDrop={(e): Promise<void> =>
          handleDrop(e, placeholderIndex, list, boardId, onRefresh, setPlaceholderIndex, setLists)
        }
        onDragLeave={(e): void => handleDragLeave(e, setPlaceholderIndex)}
        className={listStyle.list__cards}
      >
        {arrayCards}
        {placeholderIndex === list.cards.length && <div className={cardStyle.card__greySlot}>{list.title}</div>}
      </ul>
      <button type="button" className={listStyle.list__createButton} onClick={handleCreateCard}>
        Створити карточку
      </button>
      <button type="button" className={listStyle.list__createButton} onClick={deleteListData}>
        Видалити список
      </button>
    </div>
  );
}
