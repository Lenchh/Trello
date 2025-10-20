import { JSX, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BoardHome } from './components/BoardHome';
import { BoardCreation } from './components/BoardCreation';
import instance from '../../api/request';
import homeStyle from './home.module.scss';
import { IBoard } from '../../common/interfaces/IBoard';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [errorText, setErrorText] = useState<string>('');
  const [errorCreateBoard, setErrorCreateBoard] = useState('');

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const openDialog = (): void => {
    setErrorCreateBoard('');
    dialogRef.current?.showModal();
  };

  const fetchData = async (): Promise<void> => {
    try {
      const res = await instance.get('/board');
      setBoards(res.data.boards);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setErrorText('Помилка при завантаженні дошок');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const arrayBoards = boards?.map((board) => (
    <Link to={`/board/${board.id}`} key={board.id}>
      <BoardHome props={board} />
    </Link>
  ));

  return (
    <div className={homeStyle.home}>
      <h1 className={homeStyle.home__header}>Мої дошки</h1>
      {errorText && (
        <div className={homeStyle.home__header} style={{ color: 'red' }}>
          {errorText}
        </div>
      )}
      <div className={homeStyle.home__boards}>
        {arrayBoards}
        <button type="button" className={homeStyle.home__button} onClick={openDialog}>
          + Створити дошку
        </button>
      </div>
      <BoardCreation
        dialogRef={dialogRef}
        errorCreateBoard={errorCreateBoard}
        setErrorCreateBoard={setErrorCreateBoard}
        onCardCreated={fetchData}
      />
    </div>
  );
}
