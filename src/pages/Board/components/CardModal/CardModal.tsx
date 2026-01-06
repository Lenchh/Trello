import { JSX, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cardModalStyle from './cardModal.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../featchers/hooks';
import { closeModal } from '../../../../featchers/slices/modalSlice';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';

export function CardModal(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { boardId } = useParams();

  function closeWindow(): void {
    dispatch(closeModal());
    navigate(`/board/${boardId}`);
  }

  function clickToClose(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      dispatch(closeModal());
      navigate(`/board/${boardId}`);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        dispatch(closeModal());
        navigate(`/board/${boardId}`);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const exampleCard = {
    id: 1,
    title: 'Example',
    listTitle: 'List',
    members: ['lench', 'ann1', 3],
    description: '',
  };

  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const currentCard = useAppSelector((state) => state.modal.card);

  if (!isOpen || !currentCard) {
    closeWindow();
    toastrError('Помилка при завантаженні даних', 'Помилка');
  }

  const listMembers = currentCard?.users?.map((el) => {
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    return (
      <li title={`${el}`} key={exampleCard.id} style={{ backgroundColor: color }}>
        {' '}
      </li>
    );
  });

  return (
    <div className={cardModalStyle.modal} onClick={clickToClose}>
      <div className={cardModalStyle.modal__content}>
        <button className={cardModalStyle.modal__content__close} onClick={closeWindow}>
          &times;
        </button>
        <section className={cardModalStyle.modal__content__block_info}>
          <header className={cardModalStyle.header}>
            <h2>{currentCard?.title}</h2>
            <p>
              У списку <span>{currentCard?.listTitle}</span>
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
              {currentCard?.description || 'Тут може бути опис карточки...'}
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
