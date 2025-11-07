import { JSX, useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import instance from '../../../../api/request';
import { createCard } from '../Card/CreateCard';
import { EditNameList } from './EditNameList';
import listStyle from './list.module.scss';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';

interface IListProps {
  list: IList;
  boardId: string | undefined;
  onRefresh: () => Promise<void>;
}

export function List({ list, boardId, onRefresh }: IListProps): JSX.Element {
  const [isNameList, setIsNameList] = useState(true);
  const [nameList, setNameList] = useState(list.title);

  const arrayCards = list.cards.map((card) => (
    <Card card={card} listId={list.id} key={card.id} boardId={boardId} onRefresh={onRefresh} />
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
      <ul className={listStyle.list__cards}>{arrayCards}</ul>
      <button
        type="button"
        className={listStyle.list__createButton}
        onClick={(): Promise<void> => createCard(boardId, onRefresh, list.id)}
      >
        Створити карточку
      </button>
      <button type="button" className={listStyle.list__createButton} onClick={deleteList}>
        Видалити список
      </button>
    </div>
  );
}
