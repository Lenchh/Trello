import { JSX, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../api/request';
import { EditBoardName } from './components/Board1/EditBoardName';
import boardStyle from './components/Board1/board.module.scss';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';

export function Board(): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [lists, setLists] = useState<IList[]>([]);
  const [errorText, setErrorText] = useState<string>('');
  const [inputName, setInputName] = useState(false);
  const { boardId } = useParams();

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

  useEffect(() => {
    fetchData();
  }, []);

  const deleteBoard = async (): Promise<void> => {
    try {
      await instance.delete(`/board/${boardId}`);
      setErrorText('Дошку успішно видалено.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrorText('Помилка при видаленні дошки');
    }
  };

  const createList = async (): Promise<void> => {
    try {
      await instance.post(`/board/${boardId}/list`, { title: '', cards: [], position: 1 });
      fetchData();
    } catch (error) {
      setErrorText('Помилка при створенні списку.');
    }
  };

  const arrayList = lists?.map((list) => (
    <List props={list} key={list.id} boardId={boardId} onCardCreated={fetchData} />
  ));
  return (
    <div className={boardStyle.board}>
      <div className={boardStyle.board__header}>
        {inputName ? (
          <EditBoardName
            defaultValue={title}
            onCardCreated={fetchData}
            idBoard={boardId}
            setInput={setInputName}
            setInputError={setErrorText}
          />
        ) : (
          <h1 className={boardStyle.board__textHeader} onClick={(): void => setInputName(true)}>
            {title}
          </h1>
        )}
        <button className={boardStyle.board__deleteButton} onClick={deleteBoard}>
          Видалити дошку
        </button>
      </div>
      {errorText && (
        <h2 className={boardStyle.board__textHeader} style={{ color: 'brown' }}>
          {errorText}
        </h2>
      )}
      <div className={boardStyle.board__lists}>
        <div>{arrayList}</div>
        <button type="button" className={boardStyle.board__createButton} onClick={createList}>
          Create list
        </button>
      </div>
    </div>
  );
}
