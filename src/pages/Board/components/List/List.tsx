import { JSX, useEffect, useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import instance from '../../../../api/request';
import { createCard } from '../Card/CreateCard';
import { EditNameList } from './EditNameList';
import listStyle from './list.module.scss';

interface IListProps {
  props: IList;
  boardId: string | undefined;
  onCardCreated: () => Promise<void>;
}

export function List({ props, boardId, onCardCreated }: IListProps): JSX.Element {
  const [nameList, setNameList] = useState(true);

  const arrayCards = props.cards.map((card) => (
    <Card props={card} listId={props.id} key={card.id} idBoard={boardId} onCardCreated={onCardCreated} />
  ));

  const deleteList = async (): Promise<void> => {
    try {
      await instance.delete(`/board/${boardId}/list/${props.id}`);
      onCardCreated();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  return (
    <div className={listStyle.list}>
      {nameList && props.title ? (
        <h2 className={listStyle.list__header} onClick={(): void => setNameList(false)}>
          {props.title}
        </h2>
      ) : (
        <EditNameList
          defaultTitle={props.title}
          boardId={boardId}
          idList={props.id}
          onCardCreated={onCardCreated}
          setNameList={setNameList}
        />
      )}
      <ul className={listStyle.list__cards}>{arrayCards}</ul>
      <button
        type="button"
        className={listStyle.list__createButton}
        onClick={(): Promise<void> => createCard(boardId, onCardCreated, props.id)}
      >
        Створити карточку
      </button>
      <button type="button" className={listStyle.list__createButton} onClick={deleteList}>
        Видалити список
      </button>
    </div>
  );
}
