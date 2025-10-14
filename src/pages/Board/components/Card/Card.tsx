import { JSX, useState } from 'react';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';

export function Card({ title }: ICard): JSX.Element {
  return (
    <div className={cardStyle.card}>
      <li className={cardStyle.card__textCard}>{title}</li>
    </div>
  );
}
