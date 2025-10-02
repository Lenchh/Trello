// import { title } from 'process';
import { JSX, useState } from 'react';
import { ICard } from '../../../common/interfaces/ICard';
import { Card } from './Card/Card';
import './List/list.scss';

interface listProps {
  title: string;
  cards: ICard[];
}

export function List({ title, cards }: listProps): JSX.Element {
  const arrayCards = cards.map((card) => <Card title={card.title} key={card.id} />);
  return (
    <div className="list">
      <h2 className="list__header">{title}</h2>
      <ul className="list__cards">{arrayCards}</ul>
      <button type="button" className="list__create-button">
        Create card
      </button>
    </div>
  );
}
