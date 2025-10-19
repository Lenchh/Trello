import { JSX } from 'react';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';

interface ICardProps {
  props: ICard;
}

export function Card({ props }: ICardProps): JSX.Element {
  return (
    <div className={cardStyle.card}>
      <li className={cardStyle.card__textCard}>{props.title}</li>
    </div>
  );
}
