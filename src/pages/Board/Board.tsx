import { JSX, useState, useEffect, useRef, CSSProperties } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EditBoardName } from './components/EditBoard/EditBoardName';
import boardStyle from './components/EditBoard/board.module.scss';
import { List } from './components/List/List';
import { IList } from '../../common/interfaces/IList';
import { EditBackBoard } from './components/EditBoard/EditBackBoard';
import { CardModal } from './components/CardModal/CardModal';
import { useAppDispatch, useAppSelector } from '../../featchers/hooks';
import { openModal } from '../../featchers/slices/modalSlice';
import { ICard } from '../../common/interfaces/ICard';
import { clearBoardData, createList, deleteBoard, fetchBoard } from '../../featchers/slices/boardSlice';

export function Board(): JSX.Element {
  const boardData = useAppSelector((state) => state.board.board);
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('#ffffff');
  const [lists, setLists] = useState<IList[]>([]);
  const [inputNameBoard, setInputNameBoard] = useState(false);
  const [action, setAction] = useState('');
  const [oldValue, setOldValue] = useState('');
  const [backgroundForm, openBackForm] = useState(false);
  const { boardId, cardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (boardId) dispatch(fetchBoard(boardId));

    return () => {
      dispatch(clearBoardData());
    };
  }, [boardId, dispatch]);

  useEffect(() => {
    if (boardData) {
      setBackground(boardData.custom.background);
      setLists(boardData.lists!);
      setTitle(boardData.title);
      setOldValue(boardData.title);
    }
  }, [boardData]);

  const deleteBoardData = async (): Promise<void> => {
    try {
      if (boardId) {
        await dispatch(deleteBoard(boardId)).unwrap();
        navigate('/');
      }
    } catch (er) {
      setAction('');
    }
  };

  const openDialog = (): void => {
    openBackForm(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = event.target.value;
    setAction(selected);

    if (selected === 'delete') {
      deleteBoardData();
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

  const arrayList = lists?.map((list) => <List list={list} key={list.id} setLists={setLists} />);

  const handleCreateList = (): void => {
    if (boardId) dispatch(createList(boardId));
  };

  const isOpen = useAppSelector((state) => state.modal.isOpen);

  useEffect(() => {
    if (cardId) {
      lists.forEach((list) => {
        const foundCard: ICard | undefined = list.cards.find((card) => String(card.id) === cardId);
        if (foundCard) {
          dispatch(
            openModal({
              ...foundCard,
              listTitle: list.title,
              idList: list.id,
            })
          );
        }
      });
    }
  }, [lists, cardId]);

  return (
    <div className={boardStyle.container}>
      <nav>
        <Link to="/" className={boardStyle.buttonHome} style={{ '--bg-color': background } as React.CSSProperties}>
          Home
        </Link>
      </nav>
      <div style={selectBackground(background)} className={boardStyle.board}>
        <div className={boardStyle.header}>
          {inputNameBoard ? (
            <EditBoardName setInput={setInputNameBoard} nameBoard={title} setNameBoard={setTitle} oldValue={oldValue} />
          ) : (
            <h1 className={boardStyle.textHeader} onClick={(): void => setInputNameBoard(true)}>
              {title}
            </h1>
          )}
          <select value={action} onChange={handleChange} className={boardStyle.selectMenu}>
            <option value="">...</option>
            <option value="delete">Видалити дошку</option>
            <option value="changeBg">Змінити фон дошки</option>
          </select>
        </div>
        <div className={boardStyle.lists}>
          <div>{arrayList}</div>
          <button type="button" className={boardStyle.createListButton} onClick={handleCreateList}>
            Створити список
          </button>
        </div>
        {backgroundForm && (
          <EditBackBoard defaultValue={background} setAction={setAction} openBackForm={openBackForm} />
        )}
        {isOpen && <CardModal setLists={setLists} />}
      </div>
    </div>
  );
}
