import { JSX, useState } from 'react';
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
  const [isDragging, setIsDragging] = useState<number | null>(null);

  const arrayCards = list.cards.map((card) => (
    <Card
      card={card}
      listId={list.id}
      key={card.id}
      boardId={boardId}
      onRefresh={onRefresh}
      isDragging={isDragging}
      setIsDragging={setIsDragging}
    />
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

  function selectGreySlot(
    cursorPosition: number,
    draggingItem: HTMLLIElement,
    targetElement: HTMLElement,
    elementList: HTMLUListElement
  ): void {
    // const parent1 = currentElement.parentElement;
    // const parent = parent1?.parentElement;
    // if (!parent) return;
    const currentElementCoord = targetElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.top + currentElementCoord.height / 2;
    if (cursorPosition <= currentElementCenter) {
      if (targetElement.previousElementSibling !== draggingItem) {
        elementList.insertBefore(draggingItem, targetElement);
      }
    } else if (cursorPosition > currentElementCenter) {
      if (targetElement.nextElementSibling !== draggingItem) {
        elementList.insertBefore(draggingItem, targetElement.nextElementSibling);
      }
    }
    // greySlot?.classList.remove(cardStyle.hidden);
  }

  function handleDragOver(e: React.DragEvent<HTMLUListElement>): void {
    e.preventDefault();
    const elementList = e.currentTarget;
    const draggingItem = document.querySelector(`.${cardStyle.card__dragging}`) as HTMLLIElement;
    // toastrSuccess(`${elementList}`, 'elementList');
    // toastrSuccess(`${draggingItem}`, 'draggingItem');
    const targetElement = (e.target as HTMLElement).closest('li');
    if (!draggingItem || !targetElement || draggingItem === targetElement) {
      return;
    }
    selectGreySlot(e.clientY, draggingItem, targetElement, elementList);
    // // if (elementUnder.classList.contains(listStyle.list__cards) && !elementUnder.hasChildNodes()) {
    // if (elementUnder.classList.contains(cardStyle.card__textCard)) {
    //   const oldSlot = document.querySelector(`.${cardStyle.card__greySlot}:not(.${cardStyle.hidden})`);
    //   oldSlot?.classList.add(cardStyle.hidden);
    //   const greySlot = document.querySelector(`[data-id="${elementUnder.dataset.id}"].${cardStyle.card__greySlot}`);
    //   selectGreySlot(e.clientY, elementUnder, greySlot!);
    // }
  }

  function handleDragEnter(e: React.DragEvent<HTMLUListElement>): void {
    const elementUnder = e.target as HTMLDivElement;
    // if (elementUnder.classList.contains(cardStyle.card__textCard)) {
    //   const oldSlot = document.querySelector(`.${cardStyle.card__greySlot}:not(.${cardStyle.hidden})`);
    //   oldSlot?.classList.add(cardStyle.hidden);
    //   const greySlot = document.querySelector(`[data-id="${elementUnder.dataset.id}"].${cardStyle.card__greySlot}`);
    //   selectGreySlot(e.clientY, elementUnder, greySlot!);
    // }
  }

  function handleDragLeave(e: React.DragEvent<HTMLUListElement>): void {
    const elementUnder = e.target as HTMLDivElement;
    const elementUnder2 = e.relatedTarget as HTMLDivElement;
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
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={listStyle.list__cards}
      >
        {arrayCards}
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
