import { ChangeEvent, JSX, useEffect, useState } from 'react';
import { IList } from '../../../../common/interfaces/IList';
import { Card } from '../Card/Card';
import instance from '../../../../api/request';
import listStyle from './list.module.scss';

interface IListProps {
  props: IList;
  boardId: string | undefined;
  onCardCreated: () => Promise<void>;
}

export function List({ props, boardId, onCardCreated }: IListProps): JSX.Element {
  const [inputValue, setInputValue] = useState(props.title || 'Default name');
  const [nameList, setNameList] = useState(false);
  const arrayCards = props.cards.map((card) => <Card props={card} key={card.id} />);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setInputValue(event.target.value);
    }
  };

  useEffect(() => {
    if (props.title) setNameList(true);
    else setNameList(false);
    // eslint-disable-next-line no-console
    console.log(props);
  }, []);

  const editName = async (): Promise<void> => {
    if (inputValue.trim() === '') {
      return;
    }
    try {
      await instance.put(`/board/${boardId}/list/${props.id}`, { title: inputValue });
      onCardCreated();
      setNameList(true);
    } catch (error) {
      setNameList(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter' && inputValue.trim()) {
      editName();
    }
  };

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
      {nameList ? (
        <h2 className={listStyle.list__header} onClick={(): void => setNameList(false)}>
          {props.title}
        </h2>
      ) : (
        <input
          type="text"
          value={inputValue}
          className={listStyle.list__input}
          onChange={handleChange}
          onBlur={editName}
          onKeyDown={handleKeyDown}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      )}
      <ul className={listStyle.list__cards}>{arrayCards}</ul>
      <button type="button" className={listStyle.list__createButton}>
        Create card
      </button>
      <button type="button" className={listStyle.list__createButton} onClick={deleteList}>
        Delete list
      </button>
    </div>
  );
}
