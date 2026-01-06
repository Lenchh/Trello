import React, { JSX, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import instance from '../../../../api/request';
import { createCard } from '../Card/CreateCard';
import { EditNameList } from './EditNameList';
import listStyle from './list.module.scss';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';
import cardStyle from '../Card/card.module.scss';
import { handleDragLeave, handleDragOver, handleDrop } from '../../../../common/d-n-d/DragAndDrop';

interface IListProps {
  list: IList;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  cardId: string | undefined;
}

export function List({ list, boardId, onRefresh, setLists, cardId }: IListProps): JSX.Element {
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
        <Card
          card={card}
          listId={list.id}
          key={card.id}
          boardId={boardId}
          onRefresh={onRefresh}
          index={index}
          setPlaceholderIndex={setPlaceholderIndex}
          listTitle={list.title}
          cardIdURL={cardId}
        />
      </Link>
    </React.Fragment>
  ));

  const deleteList = async (): Promise<void> => {
    try {
      await instance.delete(`/board/${boardId}/list/${list.id}`);
      onRefresh();
      toastrSuccess('Список успішно видалений', 'Успіх');
    } catch (error) {
      toastrError('Помилка при видаленні списку', 'Помилка');
    }
  };

  return (
    <div className={listStyle.list}>
      {isNameList && list.title ? (
        <h2 className={listStyle.list__header} onClick={(): void => setIsNameList(false)}>
          {nameList}
        </h2>
      ) : (
        <EditNameList
          boardId={boardId}
          listId={list.id}
          onRefresh={onRefresh}
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
      <button
        type="button"
        className={listStyle.list__createButton}
        onClick={(): Promise<void> => createCard(boardId, onRefresh, list.id, list.cards.length + 1)}
      >
        Створити карточку
      </button>
      <button type="button" className={listStyle.list__createButton} onClick={deleteList}>
        Видалити список
      </button>
    </div>
  );
}
