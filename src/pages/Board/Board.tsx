import { JSX, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../api/request';
import { EditBoardName } from './components/Board1/EditBoardName';
import boardStyle from './components/Board1/board.module.scss';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { createList } from './components/List/CreateList';
import { EditBackBoard } from './components/Board1/EditBackBoard';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('#ffffff');
  const [lists, setLists] = useState<IList[]>([]);
  const [errorText, setErrorText] = useState('');
  const [inputNameBoard, setInputNameBoard] = useState(false);
  const [action, setAction] = useState('');
  const { boardId } = useParams();
  let oldValue = '';

  const fetchData = async (): Promise<void> => {
    try {
      const { data } = await instance.get(`/board/${boardId}`);
      setLists(data.lists);
      setTitle(data.title);
      oldValue = data.title;
      setBackground(data.custom.background);
    } catch (error) {
      setErrorText('Помилка при завантаженні даних');
    }
  };

  useEffect(() => {
    fetchData();
  }, [boardId]);

  const deleteBoard = async (): Promise<void> => {
    try {
      await instance.delete(`/board/${boardId}`);
      setErrorText('Дошку успішно видалено.');
    } catch (error) {
      setErrorText('Помилка при видаленні дошки');
    }
  };

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openDialog = (): void => {
    dialogRef.current?.showModal();
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = event.target.value;
    setAction(selected);

    if (selected === 'delete') {
      deleteBoard();
    } else if (selected === 'changeBg') {
      openDialog();
    }
  };

  const arrayList = lists?.map((list) => <List list={list} key={list.id} boardId={boardId} onRefresh={fetchData} />);

  return (
    <div
      style={
        background.startsWith('data')
          ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center center' }
          : ({
              backgroundColor: background,
              '--bg-color': background,
            } as React.CSSProperties)
      }
      className={boardStyle.board}
    >
      <div className={boardStyle.board__header}>
        {inputNameBoard ? (
          <EditBoardName
            onRefresh={fetchData}
            idBoard={boardId}
            setInput={setInputNameBoard}
            setInputError={setErrorText}
            nameBoard={title}
            setNameBoard={setTitle}
            oldValue={oldValue}
          />
        ) : (
          <h1 className={boardStyle.board__textHeader} onClick={(): void => setInputNameBoard(true)}>
            {title}
          </h1>
        )}
        <select value={action} onChange={handleChange} className={boardStyle.board__selectMenu}>
          <option value="">...</option>
          <option value="delete">Видалити дошку</option>
          <option value="changeBg">Змінити фон дошки</option>
        </select>
      </div>
      {errorText && <h2 className={boardStyle.board__textError}>{errorText}</h2>}
      <div className={boardStyle.board__lists}>
        <div>{arrayList}</div>
        <button
          type="button"
          className={boardStyle.board__createButton}
          onClick={(): Promise<void> => createList(boardId, fetchData, setErrorText)}
        >
          Створити список
        </button>
      </div>
      <EditBackBoard
        dialogRef={dialogRef}
        boardId={boardId}
        defaultValue={background}
        onRefresh={fetchData}
        setAction={setAction}
      />
    </div>
  );
}
