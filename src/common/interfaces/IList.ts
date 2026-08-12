import { ICard } from './ICard';

export interface IList {
  id: number;
  title: string;
  cards: ICard[];
}
