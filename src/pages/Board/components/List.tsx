import { title } from 'process';
import { JSX, useState } from 'react';
import { ICard } from '../../../common/interfaces/ICard';
import { Card } from './Card/Card';
import './List/list.scss'

interface listProps {
  title: string;
  cards: ICard[];
}

export function List(props: listProps): JSX.Element {
    const arrayCards = props.cards.map((card) => 
    <Card title={card.title} key={card.id}/>);
  return(
    <>
    <div>{props.title}</div>
    <ul>{arrayCards}</ul>
    <button type='button'>Create card</button>
    </>
  );
}
