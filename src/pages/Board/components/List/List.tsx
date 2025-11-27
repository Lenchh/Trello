import React, { JSX, useRef, useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import instance from '../../../../api/request';
import { createCard } from '../Card/CreateCard';
import { EditNameList } from './EditNameList';
import listStyle from './list.module.scss';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';
import cardStyle from '../Card/card.module.scss';

interface IListProps {
  list: IList;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
}

export function List({ list, boardId, onRefresh }: IListProps): JSX.Element {
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
      <Card card={card} listId={list.id} key={card.id} boardId={boardId} onRefresh={onRefresh} index={index} />
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

  function handleDragOver(e: React.DragEvent<HTMLUListElement>): void {
    e.preventDefault();
    if (list.cards.length === 0) {
      setPlaceholderIndex(list.cards.length);
    }
    const targetElement = (e.target as HTMLElement).closest('li') as HTMLLIElement;
    if (!targetElement) {
      return;
    }
    const currentIndex = Number(targetElement?.dataset.index);
    const currentElementCoord = targetElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.top + currentElementCoord.height / 2;
    if (e.clientY <= currentElementCenter) {
      setPlaceholderIndex(currentIndex);
    } else if (e.clientY > currentElementCenter) {
      setPlaceholderIndex(currentIndex + 1);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLUListElement>): void {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setPlaceholderIndex(null);
  }

  async function handleDrop(e: React.DragEvent<HTMLUListElement>): Promise<void> {
    if (placeholderIndex === null) return;
    const cardId = Number(e.dataTransfer.getData('cardId'));
    const listId = Number(e.dataTransfer.getData('sourceListId'));
    try {
      const currentCards = [...list.cards];
      let cardsForUpdate = currentCards;
      let finalIndex = placeholderIndex;
      if (listId === list.id) {
        const originalIndex = currentCards.findIndex((c) => c.id === cardId);
        if (originalIndex < placeholderIndex) {
          finalIndex = placeholderIndex - 1;
        }
        cardsForUpdate = currentCards.filter((c) => c.id !== cardId);
      }
      const moveCard = { id: cardId, title: list.title };
      cardsForUpdate.splice(finalIndex, 0, moveCard);
      const updateList = cardsForUpdate.map((card, index) => ({
        id: card.id,
        position: index + 1,
        list_id: list.id,
      }));
      await instance.put(`/board/${boardId}/card`, updateList);
      if (listId !== list.id) {
        const oldList = document.querySelector(`[data-id="${listId}"]`) as HTMLUListElement;
        const oldCards = Array.from(oldList?.querySelectorAll('li'));
        const oldListPos = oldCards
          .map((li) => Number(li.dataset.id))
          .filter((id) => id !== cardId)
          .map((id, index) => ({
            id,
            position: index + 1,
            list_id: listId,
          }));
        await instance.put(`/board/${boardId}/card`, oldListPos);
      }
      onRefresh();
    } catch (error) {
      toastrError('Помилка при спробі змінити дані', 'Помилка');
    }
    setPlaceholderIndex(null);
  }

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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
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
