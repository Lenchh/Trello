import { JSX, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import { useNavigate, useParams } from 'react-router-dom';
import cardModalStyle from './cardModal.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../featchers/hooks';
import { closeModal } from '../../../../featchers/slices/modalSlice';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';
import { EditNameCard } from '../Card/EditNameCard';
import deleteIcon from '../../../../assets/delete_icon.svg';
import arrowIcon from '../../../../assets/arrow_icon.svg';
import copyIcon from '../../../../assets/copy_icon.svg';
import { WindowOfChangePosition } from './CardModalComponents/WindowOfChangePosition';
import { IList } from '../../../../common/interfaces/IList';
import { WindowOfCopyCard } from './CardModalComponents/WindowOfCopyCard';
import { deleteCard, updatePosCards } from '../../../../featchers/slices/boardSlice';

interface props {
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
}

export function CardModal({ setLists }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { boardId, cardId } = useParams();

  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const currentCard = useAppSelector((state) => state.modal.card);
  const currentLists = useAppSelector((state) => state.board.board?.lists);

  const [isCompleted, setCompleted] = useState(currentCard?.title.includes('|DONE|') || false);

  const [isNameCard, setIsNameCard] = useState(true);
  const cleanTitle = currentCard?.title.replace('|DONE|', '').trim();
  const [nameCard, setNameCard] = useState(cleanTitle || 'Default name');

  const [isDescriptionCard, setIsDescription] = useState(true);
  const [descriptionCard, setDescription] = useState(currentCard?.description || '');

  const [CopyCard, setCopyCard] = useState(false);
  const [isChangePosition, setIsChangePosition] = useState(false);

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
      if (event.key === 'Escape' && isNameCard && isDescriptionCard) {
        dispatch(closeModal());
        navigate(`/board/${boardId}`);
      }
      if (event.key === 'Escape' && (!isNameCard || !isDescriptionCard)) {
        if (!isNameCard) {
          setNameCard(currentCard?.title.replace('|DONE|', '') || 'Default name');
          setIsNameCard(true);
        } else {
          setDescription(currentCard?.description || '');
          setIsDescription(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNameCard, isDescriptionCard]);

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

  const deleteCardData = async (): Promise<void> => {
    try {
      const oldList = currentLists?.find((list) => list.id === currentCard?.idList);
      if (boardId && cardId) await dispatch(deleteCard({ boardId, cardId })).unwrap();
      const cardsOldPositions = oldList ? [...oldList.cards] : [];
      const oldPosCards = cardsOldPositions
        ?.filter((card) => card.id !== Number(cardId))
        .map((card, index) => ({
          id: card.id,
          position: index + 1,
          list_id: oldList!.id,
        }));
      if (boardId) await dispatch(updatePosCards({ boardId, oldPosCards })).unwrap();
      closeWindow();
    } catch (error) {
      console.log('error with deletion card.');
    }
  };

  return (
    <div className={cardModalStyle.modal} onClick={clickToClose}>
      <div className={cardModalStyle.content}>
        <button className={cardModalStyle.close} onClick={closeWindow}>
          &times;
        </button>
        <section className={cardModalStyle.blockInfo}>
          <header className={cardModalStyle.header}>
            {isNameCard && currentCard?.title ? (
              <h2 onClick={(): void => setIsNameCard(false)}>{nameCard}</h2>
            ) : (
              <EditNameCard
                listId={currentCard?.idList}
                cardId={currentCard?.id}
                setIsNameCard={setIsNameCard}
                nameCard={nameCard}
                setNameCard={setNameCard}
                oldValue={currentCard?.title.replace('|DONE|', '')}
                infoCard="title"
                isCompleted={isCompleted}
              />
            )}
            <p>
              У списку <span>{currentCard?.listTitle}</span>
            </p>
          </header>
          <div className={cardModalStyle.members}>
            <h3 className={cardModalStyle.headerMembers}>УЧАСНИКИ</h3>
            <ul>
              {listMembers}
              <li>
                <button className={cardModalStyle.buttonAddMember}>+</button>
              </li>
            </ul>
          </div>
          <div className={cardModalStyle.description}>
            <div className={cardModalStyle.headerDesc}>
              <h3>ОПИС</h3>
              <button onClick={(): void => setIsDescription(false)} aria-label="Description card">
                {' '}
              </button>
            </div>
            {isDescriptionCard ? (
              <div className={cardModalStyle.contentDesc} onClick={(): void => setIsDescription(false)}>
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkGemoji]}>{descriptionCard}</ReactMarkdown>
              </div>
            ) : (
              <EditNameCard
                listId={currentCard?.idList}
                cardId={currentCard?.id}
                setIsNameCard={setIsDescription}
                nameCard={descriptionCard}
                setNameCard={setDescription}
                oldValue={currentCard?.description}
                infoCard="description"
                isCompleted={isCompleted}
              />
            )}
          </div>
        </section>

        <section className={cardModalStyle.blockActions}>
          <div>
            <h3>ДІЇ</h3>
            <ul>
              <li>
                <button className={cardModalStyle.action} onClick={(): void => setCopyCard(true)}>
                  <img src={copyIcon} alt="copy icon" />
                  <span>Копіювати</span>
                </button>
              </li>
              <li>
                <button className={cardModalStyle.action} onClick={(): void => setIsChangePosition(true)}>
                  <img src={arrowIcon} alt="copy icon" />
                  <span>Перемістити</span>
                </button>
              </li>
              <li>
                <button className={`${cardModalStyle.action} ${cardModalStyle.deleteButton}`} onClick={deleteCardData}>
                  <img src={deleteIcon} alt="copy icon" />
                  <span>Видалити</span>
                </button>
              </li>
            </ul>
          </div>
        </section>
      </div>
      {isChangePosition && (
        <WindowOfChangePosition
          setIsChangePosition={setIsChangePosition}
          currentCard={currentCard!}
          setLists={setLists}
        />
      )}
      {CopyCard && <WindowOfCopyCard setCopyCard={setCopyCard} currentCard={currentCard!} setLists={setLists} />}
    </div>
  );
}
