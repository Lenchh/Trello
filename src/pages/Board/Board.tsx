import { JSX, useState } from 'react';
import boardStyle from './components/Board1/board.module.scss';
import boardHomeStyle from './components/Board1/boardHome.module.scss';
import { List } from './components/List';

export function Board(): JSX.Element {
  const exampleLists = [
    {
      id: 1,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 2,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 3,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 4,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 5,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 6,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 7,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 8,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 9,
      title: 'Плани',
      cards: [
        { id: 1, title: 'помити кота' },
        { id: 2, title: 'приготувати суп' },
        { id: 3, title: 'сходити в магазин' },
      ],
    },
    {
      id: 10,
      title: 'В процесі',
      cards: [{ id: 4, title: 'подивитися серіал' }],
    },
    {
      id: 11,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
    {
      id: 12,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
    {
      id: 13,
      title: 'Зроблено',
      cards: [
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
        { id: 5, title: 'зробити домашку' },
        { id: 6, title: 'погуляти з собакой' },
      ],
    },
  ];
  const [title, setTitle] = useState('Моя тестова дошка');
  const [lists, setLists] = useState(exampleLists);
  const arrayList = lists.map((list) => <List title={list.title} cards={list.cards} key={list.id} />);
  return (
    <div className={boardStyle.board}>
      <h1 className={boardStyle.board__header}>{title}</h1>
      <div className={boardStyle.board__lists}>
        <div>{arrayList}</div>
        <button type="button" className={boardStyle.board__createButton}>
          Create list
        </button>
      </div>
    </div>
  );
}

interface propsBoard {
  title: string;
  custom: { background: string };
}

export function BoardHome({ title, custom }: propsBoard): JSX.Element {
  return (
    <div style={custom} className={boardHomeStyle.board}>
      <h2 className={boardHomeStyle.textHead}>{title}</h2>
    </div>
  );
}
