import { JSX, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../api/request';
import boardStyle from './components/Board1/board.module.scss';
import boardHomeStyle from './components/Board1/boardHome.module.scss';
import { List } from './components/List';
import { IBoard } from '../../common/interfaces/IBoard';
import { IList } from '../../common/interfaces/IList';

export function Board(): JSX.Element {
  const [title, setTitle] = useState<string>();
  const [lists, setLists] = useState<IList[]>();
  const [errorText, setErrorText] = useState<string | null>(null);
  const { boardId } = useParams();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const { data } = await instance.get(`/board/${boardId}`);
        setLists(data.lists);
        setTitle(data.title);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorText('Помилка при завантаженні даних');
      }
    };
    fetchData();
  }, []);

  const arrayList = lists?.map((list) => <List id={list.id} title={list.title} cards={list.cards} key={list.id} />);
  return (
    <div className={boardStyle.board}>
      <h1 className={boardStyle.board__header}>
        {title} {boardId}
      </h1>
      {errorText && (
        <div className={boardStyle.board__header} style={{ color: 'red' }}>
          {errorText}
        </div>
      )}
      <div className={boardStyle.board__lists}>
        <div>{arrayList}</div>
        <button type="button" className={boardStyle.board__createButton}>
          Create list
        </button>
      </div>
    </div>
  );
}

export function BoardHome({ title, custom }: IBoard): JSX.Element {
  return (
    <div style={custom} className={boardHomeStyle.board}>
      <h2 className={boardHomeStyle.textHead}>{title}</h2>
    </div>
  );
}
