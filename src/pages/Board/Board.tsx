import { JSX, useState, useEffect, useRef, CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import instance from '../../api/request';
import { EditBoardName } from './components/EditBoard/EditBoardName';
import boardStyle from './components/EditBoard/board.module.scss';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { createList } from './components/List/CreateList';
import { EditBackBoard } from './components/EditBoard/EditBackBoard';
import { toastrError } from '../../common/toastr/error/toastr-options-error';
import { toastrSuccess } from '../../common/toastr/success/toastr-options-success';
import { CardModal } from './components/CardModal/CardModal';

export function Board(): JSX.Element {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('#ffffff');
  const [lists, setLists] = useState<IList[]>([]);
  const [inputNameBoard, setInputNameBoard] = useState(false);
  const [action, setAction] = useState('');
  const { boardId } = useParams();
  const [oldValue, setOldValue] = useState('');
  const [modal, openModal] = useState(false);

  const fetchData = async (): Promise<void> => {
    try {
      const { data } = await instance.get(`/board/${boardId}`);
      setLists(data.lists);
      setTitle(data.title);
      setOldValue(data.title);
      setBackground(data.custom.background);
    } catch (error) {
      toastrError('Помилка при завантаженні даних', 'Помилка');
    }
  };

  useEffect(() => {
    fetchData();
  }, [boardId]);

  const deleteBoard = async (): Promise<void> => {
    try {
      await instance.delete(`/board/${boardId}`);
      toastrSuccess('Дошку успішно видалено.', 'Успіх');
    } catch (error) {
      toastrError('Помилка при видаленні дошки', 'Помилка');
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

  function selectBackground(back: string): CSSProperties {
    return back.startsWith('data')
      ? { backgroundImage: `url(${back})`, backgroundSize: 'cover', backgroundPosition: 'center center' }
      : ({
          backgroundColor: back,
          '--bg-color': back,
        } as React.CSSProperties);
  }

  const arrayList = lists?.map((list) => (
    <List list={list} key={list.id} boardId={boardId} onRefresh={fetchData} setLists={setLists} />
  ));

  return (
    <div className={boardStyle.container}>
      <nav>
        <Link
          to="/"
          className={boardStyle.container__button_home}
          style={{ '--bg-color': background } as React.CSSProperties}
        >
          Home
        </Link>
      </nav>
      <div style={selectBackground(background)} className={boardStyle.container__board}>
        <div className={boardStyle.container__board__header}>
          {inputNameBoard ? (
            <EditBoardName
              onRefresh={fetchData}
              idBoard={boardId}
              setInput={setInputNameBoard}
              nameBoard={title}
              setNameBoard={setTitle}
              oldValue={oldValue}
            />
          ) : (
            <h1 className={boardStyle.container__board__textHeader} onClick={(): void => setInputNameBoard(true)}>
              {title}
            </h1>
          )}
          <select value={action} onChange={handleChange} className={boardStyle.container__board__selectMenu}>
            <option value="">...</option>
            <option value="delete">Видалити дошку</option>
            <option value="changeBg">Змінити фон дошки</option>
          </select>
        </div>
        <div className={boardStyle.container__board__lists}>
          <div>{arrayList}</div>
          <button
            type="button"
            className={boardStyle.container__board__createButton}
            onClick={(): Promise<void> => createList(boardId, fetchData)}
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
        <button id="myBtn" onClick={(): void => openModal(!modal)}>
          Open Modal
        </button>
        {modal && <CardModal openModal={openModal} />}
      </div>
    </div>
  );
}
