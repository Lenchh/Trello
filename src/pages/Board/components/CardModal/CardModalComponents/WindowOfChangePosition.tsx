import { JSX, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import positionModalStyle from './changePositionWindow.module.scss';
import { useAppDispatch, useAppSelector } from '../../../../../featchers/hooks';
import { ICard } from '../../../../../common/interfaces/ICard';
import { toastrSuccess } from '../../../../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../../../../common/toastr/error/toastr-options-error';
import { IList } from '../../../../../common/interfaces/IList';
import { toastrInfo } from '../../../../../common/toastr/info/toastr-options-info';
import { updatePosCards } from '../../../../../featchers/slices/boardSlice';

interface props {
  setIsChangePosition: React.Dispatch<React.SetStateAction<boolean>>;
  currentCard: ICard;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
}

export function WindowOfChangePosition({ setIsChangePosition, currentCard, setLists }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const oldListId = currentCard.idList;
  const [selectedList, setSelectedList] = useState(currentCard.idList);
  const [selectedPosition, setSelectedPosition] = useState(currentCard.position || 0);

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
    const isSameList = currentCard.idList === selectedList;
    const cardsCount = targetList.cards ? targetList.cards.length : 0;

    const availablePositions = isSameList ? cardsCount : cardsCount + 1;

    const positionsArray = Array.from({ length: availablePositions }, (_, i) => i + 1);

    return positionsArray.map((position) => (
      <option value={position} key={position}>
        {position}
      </option>
    ));
  }, [targetList]);

  function closeWindow(): void {
    setIsChangePosition(false);
  }

  function clickToClose(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      setIsChangePosition(false);
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

  const moveCard = async (): Promise<void> => {
    try {
      if (selectedPosition === currentCard.position && selectedList === currentCard.idList) {
        toastrInfo('Позиція картки при цьому переміщенні не зміниться', 'Інформація');
        return;
      }
      const currentGroupCards = targetList?.cards;
      let cardsNewPositions = currentGroupCards ? [...currentGroupCards] : [];
      const oldList = currentLists?.find((list) => list.id === oldListId)?.cards;
      let cardsOldPositions = oldList ? [...oldList] : [];
      if (currentCard.idList === selectedList) {
        cardsNewPositions = cardsNewPositions.filter((c) => c.id !== currentCard.id);
      } else {
        cardsOldPositions = cardsOldPositions.filter((c) => c.id !== currentCard.id);
        setLists((prevList) =>
          prevList.map((l) => {
            if (l.id === oldListId) {
              return { ...l, cards: cardsOldPositions! };
            }
            return l;
          })
        );
      }
      cardsNewPositions?.splice(selectedPosition - 1, 0, { ...currentCard });
      setLists((prevList) =>
        prevList.map((l) => {
          if (l.id === selectedList) {
            return { ...l, cards: cardsNewPositions! };
          }
          return l;
        })
      );
      const updateCards = cardsNewPositions?.map((card, index) => ({
        id: card.id,
        position: index + 1,
        list_id: selectedList!,
      }));
      if (boardId) await dispatch(updatePosCards({ boardId, oldPosCards: updateCards })).unwrap();
      if (oldListId !== selectedList && oldListId) {
        const oldListPos = oldList
          ?.filter((card) => card.id !== currentCard.id)
          .map((card, index) => ({
            id: card.id,
            position: index + 1,
            list_id: oldListId,
          }));
        if (boardId && oldListPos) await dispatch(updatePosCards({ boardId, oldPosCards: oldListPos })).unwrap();
      }
      toastrSuccess('Позиція картки успішно змінена', 'Успіх');
    } catch (error) {
      toastrError('Помилка при зміні позиції картки', 'Помилка');
    }
  };

  return (
    <div className={positionModalStyle.modal} onClick={clickToClose}>
      <div className={positionModalStyle.content}>
        <button className={positionModalStyle.close} onClick={closeWindow}>
          &times;
        </button>
        <div className={positionModalStyle.form}>
          <h2>Перемістити картку</h2>
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
          <button type="button" className={positionModalStyle.buttonMove} onClick={moveCard}>
            Перемістити
          </button>
        </div>
      </div>
    </div>
  );
}
