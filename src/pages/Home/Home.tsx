import { JSX, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BoardHome } from '../Board/Board';
import instance from '../../api/request';
import homeStyle from './home.module.scss';
import { IBoard } from '../../common/interfaces/IBoard';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>();
  const [errorText, setErrorText] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const { data } = await instance.get('/board');
        setBoards(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorText('Помилка при завантаженні дошок');
      }
    };
    fetchData();
  }, []);
  const arrayBoards = boards?.map((board) => (
    <Link to={`/board/${board.id}`} key={board.id}>
      {' '}
      <BoardHome title={board.title} custom={board.custom} key={board.id} id={board.id} />{' '}
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
        <button type="button" className={homeStyle.home__button}>
          + Create board
        </button>
      </div>
    </div>
  );
}
