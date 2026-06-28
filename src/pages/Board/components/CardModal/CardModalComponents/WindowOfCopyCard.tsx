import { ChangeEvent, JSX, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import positionModalStyle from './changePositionWindow.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../../featchers/hooks';
import { ICard } from '../../../../../common/interfaces/ICard';
import { toastrSuccess } from '../../../../../common/toastr/success/toastr-options-success';
import instance from '../../../../../api/request';
import { toastrError } from '../../../../../common/toastr/error/toastr-options-error';
import { IList } from '../../../../../common/interfaces/IList';
import { updatePosCards } from '../../../../../featchers/slices/boardSlice';

interface props {
  setCopyCard: React.Dispatch<React.SetStateAction<boolean>>;
  currentCard: ICard;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
}

export function WindowOfCopyCard({ setCopyCard, currentCard, setLists }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const [selectedList, setSelectedList] = useState(currentCard.idList);
  const [selectedPosition, setSelectedPosition] = useState(currentCard.position || 0);
  const [newNameCard, setNewNameCard] = useState(currentCard.title.replace('|DONE|', ''));

  const currentLists = useAppSelector((state) => state.board.board?.lists);

  const listsOptions = currentLists?.map((list) => (
    <option value={list.id} key={list.id}>
      {list.title}
    </option>
  ));

  const targetList = useMemo(
    () => currentLists?.find((list) => list.id === selectedList),
    [currentLists, selectedList]
  );

  const positionOptions = useMemo(() => {
    if (!targetList) return [];
    const cardsCount = targetList.cards ? targetList.cards.length : 0;

    const availablePositions = cardsCount + 1;

    const positionsArray = Array.from({ length: availablePositions }, (_, i) => i + 1);

    return positionsArray.map((position) => (
      <option value={position} key={position}>
        {position}
      </option>
    ));
  }, [targetList]);

  function closeWindow(): void {
    setCopyCard(false);
  }

  function clickToClose(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      setCopyCard(false);
    }
  }

  const handleChangeList = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = event.target.value;
    setSelectedList(Number(selected));
    setSelectedPosition(1);
  };

  const handleChangePosition = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selected = event.target.value;
    setSelectedPosition(Number(selected));
  };

  const copyCard = async (): Promise<void> => {
    try {
      const currentGroupCards = targetList?.cards;
      const cardsNewPositions = currentGroupCards ? [...currentGroupCards] : [];
      const finalName = newNameCard || currentCard?.title.replace('|DONE|', '');
      const newId = Date.now();
      cardsNewPositions?.splice(selectedPosition - 1, 0, { ...currentCard, title: finalName, id: newId });
      setLists((prevList) =>
        prevList.map((l) => {
          if (l.id === selectedList) {
            return { ...l, cards: cardsNewPositions! };
          }
          return l;
        })
      );
      const responce = await instance.post(`/board/${boardId}/card`, {
        title: finalName,
        list_id: selectedList,
        position: selectedPosition,
        description: currentCard.description,
      });
      const realId = responce.data.id;
      const updateCards = cardsNewPositions?.map((card, index) => {
        if (card.id === newId) {
          return {
            id: realId,
            position: index + 1,
            list_id: selectedList!,
          };
        }
        return {
          id: card.id,
          position: index + 1,
          list_id: selectedList!,
        };
      });
      if (boardId) await dispatch(updatePosCards({ boardId, oldPosCards: updateCards })).unwrap();
      toastrSuccess('Картка успішно скопійована', 'Успіх');
    } catch (error) {
      toastrError('Помилка при спробі скопіювати картку', 'Помилка');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setNewNameCard(event.target.value);
    }
  };

  return (
    <div className={positionModalStyle.modal} onClick={clickToClose}>
      <div className={positionModalStyle.content}>
        <button className={positionModalStyle.close} onClick={closeWindow}>
          &times;
        </button>
        <div className={positionModalStyle.form}>
          <h2>Копіювати картку</h2>
          <label>
            ІМ'Я КАРТКИ
            <textarea
              placeholder={newNameCard}
              value={newNameCard}
              onChange={handleChange}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </label>
          <label>
            СПИСОК
            <select value={selectedList} onChange={handleChangeList}>
              {listsOptions}
            </select>
          </label>
          <label>
            ПОЗИЦІЯ
            <select value={selectedPosition} onChange={handleChangePosition}>
              {positionOptions}
            </select>
          </label>
          <button type="button" className={positionModalStyle.buttonMove} onClick={copyCard}>
            Копіювати
          </button>
        </div>
      </div>
    </div>
  );
}
