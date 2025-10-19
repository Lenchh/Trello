import { JSX } from 'react';
import { IList } from '../../../common/interfaces/IList';
import { Card } from './Card/Card';
import listStyle from './List/list.module.scss';

interface IListProps {
  props: IList;
}

export function List({ props }: IListProps): JSX.Element {
  const arrayCards = props.cards.map((card) => <Card props={card} key={card.id} />);
  return (
    <div className={listStyle.list}>
      <h2 className={listStyle.list__header}>{props.title}</h2>
      <ul className={listStyle.list__cards}>{arrayCards}</ul>
      <button type="button" className={listStyle.list__createButton}>
        Create card
      </button>
    </div>
  );
}
