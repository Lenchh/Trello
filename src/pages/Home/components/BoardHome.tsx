import { JSX } from 'react';
import { IBoard } from '../../../common/interfaces/IBoard';
import boardHomeStyle from './boardHome.module.scss';

interface IBoardProps {
  props: IBoard;
}

export function BoardHome({ props }: IBoardProps): JSX.Element {
  return (
    <div
      style={
        props.custom.background.startsWith('data')
          ? {
              backgroundImage: `url(${props.custom.background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }
          : { backgroundColor: props.custom.background }
      }
      className={boardHomeStyle.board}
    >
      <h2 className={boardHomeStyle.textHead}>{props.title}</h2>
    </div>
  );
}
