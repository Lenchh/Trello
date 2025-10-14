// import { title } from 'process';
import { JSX, useState } from 'react';
import { IList } from '../../../common/interfaces/IList';
import { Card } from './Card/Card';
import listStyle from './List/list.module.scss';

export function List({ title, cards }: IList): JSX.Element {
  const arrayCards = cards.map((card) => <Card title={card.title} key={card.id} id={card.id} />);
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
