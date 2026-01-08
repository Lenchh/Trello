import { CSSProperties, JSX, useState } from 'react';
import { IBoard } from '../../../common/interfaces/IBoard';
import boardHomeStyle from './boardHome.module.scss';

interface IBoardProps {
  props: IBoard;
}

function selectBackground(props: IBoard, isHover: boolean): CSSProperties {
  const baseStyle = props.custom.background.startsWith('data')
    ? {
        backgroundImage: `url(${props.custom.background})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }
    : { backgroundColor: props.custom.background, boxShadow: `6px 12px 15px ${props.custom.background}` };
  let shadow = isHover ? `5px 8px 15px ${props.custom.background}` : '';
  if (shadow && props.custom.background.startsWith('data')) {
    shadow = `3px 5px 15px #136CF1`;
  }
  return {
    ...baseStyle,
    boxShadow: shadow,
  };
}

export function BoardHome({ props }: IBoardProps): JSX.Element {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      style={selectBackground(props, isHover)}
      className={boardHomeStyle.board}
      onMouseEnter={(): void => setIsHover(true)}
      onMouseLeave={(): void => setIsHover(false)}
    >
      <h2 className={boardHomeStyle.textHead}>{props.title}</h2>
    </div>
  );
}
