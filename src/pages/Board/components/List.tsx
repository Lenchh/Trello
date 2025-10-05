// import { title } from 'process';
import { JSX, useState } from 'react';
import { ICard } from '../../../common/interfaces/ICard';
import { Card } from './Card/Card';
import listStyle from './List/list.module.scss';

interface listProps {
  title: string;
  cards: ICard[];
}

export function List({ title, cards }: listProps): JSX.Element {
  const arrayCards = cards.map((card) => <Card title={card.title} key={card.id} />);
  return (
    <div className={listStyle.list}>
      <h2 className={listStyle.list__header}>{title}</h2>
      <ul className={listStyle.list__cards}>{arrayCards}</ul>
      <button type="button" className={listStyle.list__createButton}>
        Create card
      </button>
    </div>
  );
}
