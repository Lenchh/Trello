import { JSX, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cardModalStyle from './cardModal.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../featchers/hooks';
import { closeModal } from '../../../../featchers/slices/modalSlice';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';
import { EditNameCard } from '../Card/EditNameCard';
import instance from '../../../../api/request';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import deleteIcon from '../../../../common/images/delete_icon.svg';
import arrowIcon from '../../../../common/images/arrow_icon.svg';
import copyIcon from '../../../../common/images/copy_icon.svg';

interface props {
  onRefresh: () => Promise<void>;
}

export function CardModal({ onRefresh }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { boardId, cardId } = useParams();

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

  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const currentCard = useAppSelector((state) => state.modal.card);

  if (!isOpen || !currentCard) {
    closeWindow();
    toastrError('Помилка при завантаженні даних', 'Помилка');
  }

  const listMembers = currentCard?.users?.map((el) => {
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    return (
      <li title={`${el}`} key={currentCard.id} style={{ backgroundColor: color }}>
        {' '}
      </li>
    );
  });

  const [isNameCard, setIsNameCard] = useState(true);
  const [nameCard, setNameCard] = useState(currentCard?.title || 'Default name');

  const [isDescriptionCard, setIsDescription] = useState(true);
  const [descriptionCard, setDescription] = useState(currentCard?.description || 'Тут може бути опис карточки...');

  const deleteCard = async (): Promise<void> => {
    try {
      await instance.delete(`/board/${boardId}/card/${cardId}`);
      onRefresh();
      toastrSuccess('Карточка успішно видалена', 'Успіх');
      closeWindow();
    } catch (error) {
      toastrError('Помилка при видаленні карточки', 'Помилка');
    }
  };

  return (
    <div className={cardModalStyle.modal} onClick={clickToClose}>
      <div className={cardModalStyle.modal__content}>
        <button className={cardModalStyle.modal__content__close} onClick={closeWindow}>
          &times;
        </button>
        <section className={cardModalStyle.modal__content__block_info}>
          <header className={cardModalStyle.header}>
            {isNameCard && currentCard?.title ? (
              <h2 onClick={(): void => setIsNameCard(false)}>{nameCard}</h2>
            ) : (
              <EditNameCard
                idList={currentCard?.idList}
                idBoard={boardId}
                idCard={currentCard?.id}
                onRefresh={onRefresh}
                setIsNameCard={setIsNameCard}
                nameCard={nameCard}
                setNameCard={setNameCard}
                oldValue={currentCard?.title}
                infoCard="title"
              />
            )}
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
              <button onClick={(): void => setIsDescription(false)}> </button>
            </div>
            {isDescriptionCard ? (
              <p className={cardModalStyle.description__content} onClick={(): void => setIsDescription(false)}>
                {descriptionCard}
              </p>
            ) : (
              <EditNameCard
                idList={currentCard?.idList}
                idBoard={boardId}
                idCard={currentCard?.id}
                onRefresh={onRefresh}
                setIsNameCard={setIsDescription}
                nameCard={descriptionCard}
                setNameCard={setDescription}
                oldValue={currentCard?.description}
                infoCard="description"
              />
            )}
          </div>
        </section>

        <section className={cardModalStyle.modal__content__block_actions}>
          <div>
            <h3>ДІЇ</h3>
            <ul>
              <li>
                <button className={cardModalStyle.action}>
                  <img src={copyIcon} alt="copy icon" />
                  <span>Копіювати</span>
                </button>
              </li>
              <li>
                <button className={cardModalStyle.action}>
                  <img src={arrowIcon} alt="copy icon" />
                  <span>Перемістити</span>
                </button>
              </li>
              <li>
                <button className={`${cardModalStyle.action} ${cardModalStyle.deleteButton}`} onClick={deleteCard}>
                  <img src={deleteIcon} alt="copy icon" />
                  <span>Видалити</span>
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
