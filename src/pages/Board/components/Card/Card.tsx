import { JSX, useState } from 'react';
import cardStyle from './card.module.scss';
import { ICard } from '../../../../common/interfaces/ICard';
import { EditNameCard } from './EditNameCard';

interface ICardProps {
  props: ICard;
  listId: number;
  idBoard: string | undefined;
  onCardCreated: () => Promise<void>;
}

export function Card({ props, listId, idBoard, onCardCreated }: ICardProps): JSX.Element {
  const [nameCard, setNameCard] = useState(true);
  return (
    <div className={cardStyle.card}>
      {nameCard && props.title ? (
        <li className={cardStyle.card__textCard} onClick={(): void => setNameCard(false)}>
          {props.title}
        </li>
      ) : (
        <EditNameCard
          idList={listId}
          defaultTitle={props.title}
          boardId={idBoard}
          idCard={props.id}
          onCardCreated={onCardCreated}
          setNameCard={setNameCard}
        />
      )}
    </div>
  );
}
