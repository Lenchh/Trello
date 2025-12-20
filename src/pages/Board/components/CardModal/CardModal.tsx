import { JSX, useEffect, useMemo } from 'react';
import cardModalStyle from './cardModal.module.scss';

interface cardModal {
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CardModal({ openModal }: cardModal): JSX.Element {
  function closeModal(): void {
    openModal(false);
  }

  function clickToClose(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) openModal(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') openModal(false);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const example = {
    id: 1,
    title: 'Example',
    listTitle: 'List',
    members: ['lench', 'ann1', 3],
    description: '',
  };

  const listMembers = example.members.map((el) => {
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    return (
      <li title={`${el}`} key={example.id} style={{ backgroundColor: color }}>
        {' '}
      </li>
    );
  });

  return (
    <div className={cardModalStyle.modal} onClick={clickToClose}>
      <div className={cardModalStyle.modal__content}>
        <button className={cardModalStyle.modal__content__close} onClick={closeModal}>
          &times;
        </button>
        <section className={cardModalStyle.modal__content__block_info}>
          <header className={cardModalStyle.header}>
            <h2>{example.title}</h2>
            <p>
              У списку <span>{example.listTitle}</span>
            </p>
          </header>
          <div className={cardModalStyle.members}>
            <h3 className={cardModalStyle.members__header}>УЧАСНИКИ</h3>
            <ul>
              {listMembers}
              <li>
                <button className={cardModalStyle.members__addMember}>+</button>
              </li>
            </ul>
          </div>
          <div className={cardModalStyle.description}>
            <div className={cardModalStyle.description__header}>
              <h3>ОПИС</h3>
              <button>Змінити</button>
            </div>
            <p className={cardModalStyle.description__content}>
              {example.description || 'Тут може бути опис карточки...'}
            </p>
          </div>
        </section>

        <section className={cardModalStyle.modal__content__block_actions}>
          <div>
            <h3>ДІЇ</h3>
            <ul>
              <li>
                <button className={cardModalStyle.action}>Копіювати</button>
              </li>
              <li>
                <button className={`${cardModalStyle.action} ${cardModalStyle.deleteButton}`}>Архівувати</button>
              </li>
              <li>
                <button className={cardModalStyle.action}>Перемістити</button>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
