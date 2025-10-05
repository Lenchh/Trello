import { JSX, useState } from 'react';
import cardStyle from './card.module.scss';

interface propsCard {
  title: string;
}

export function Card({ title }: propsCard): JSX.Element {
  return (
    <div className={cardStyle.card}>
      <li className={cardStyle.card__textCard}>{title}</li>
    </div>
  );
}
