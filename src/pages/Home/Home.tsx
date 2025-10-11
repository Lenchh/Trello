import { JSX, useState } from 'react';
import { Link } from 'react-router-dom';
import { BoardHome } from '../Board/Board';
import homeStyle from './home.module.scss';

export function Home(): JSX.Element {
  const exampleBoards = [
    { id: 1, title: 'покупки', custom: { background: 'pink' } },
    { id: 2, title: 'підготовка до весілля', custom: { background: 'crimson' } },
    { id: 3, title: 'розробка інтернет-магазину', custom: { background: 'slateblue' } },
    {
      id: 4,
      title: 'курс по просуванню у соцмережах курс по просуванню у соцмережах',
      custom: { background: 'coral' },
    },
    { id: 5, title: 'покупки', custom: { background: 'teal' } },
    { id: 6, title: 'підготовка до весілля', custom: { background: 'darkgoldenrod' } },
    { id: 7, title: 'розробка інтернет-магазину', custom: { background: 'lightsalmon' } },
    { id: 8, title: 'курс по просуванню у соцмережах', custom: { background: 'brown' } },
  ];
  const [boards, setBoards] = useState(exampleBoards);
  const arrayBoards = boards.map((board) => (
    <Link to={`/board/${board.id}`} key={board.id}>
      {' '}
      <BoardHome title={board.title} custom={board.custom} key={board.id} id={board.id} />{' '}
    </Link>
  ));

  return (
    <div className={homeStyle.home}>
      <h1 className={homeStyle.home__header}>Мої дошки</h1>
      <div className={homeStyle.home__boards}>
        {arrayBoards}
        <button type="button" className={homeStyle.home__button}>
          + Create board
        </button>
      </div>
    </div>
  );
}
