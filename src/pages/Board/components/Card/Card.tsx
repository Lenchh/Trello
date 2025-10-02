import { JSX, useState } from 'react';
import './card.scss';

interface propsCard {
  title: string;
}

export function Card({ title }: propsCard): JSX.Element {
  return (
    <div className="card">
      <li className="card__text-card">{title}</li>
    </div>
  );
}
