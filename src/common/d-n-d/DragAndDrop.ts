import { ICard } from '../interfaces/ICard';
import cardStyle from '../../pages/Board/components/Card/card.module.scss';
import { IList } from '../interfaces/IList';
import { toastrError } from '../toastr/error/toastr-options-error';
import instance from '../../api/request';

export function handleDragStart(
  e: React.DragEvent<HTMLLIElement>,
  card: ICard,
  listId: number,
  index: number,
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>
): void {
  e.dataTransfer.effectAllowed = 'move';
  const target = e.currentTarget;
  e.dataTransfer.setData('cardId', String(card.id));
  e.dataTransfer.setData('sourceListId', String(listId));
  e.dataTransfer.setData('cardTitle', String(card.title));
  const slot = document.createElement('div');
  slot.classList.add(cardStyle.card);
  slot.classList.add(cardStyle.card__ghost);
  slot.textContent = card.title;
  document.body.appendChild(slot);
  e.dataTransfer.setDragImage(slot, slot.offsetWidth / 2, slot.offsetHeight / 2);
  setTimeout(() => {
    slot.remove();
    target.classList.add(cardStyle.card__dragging);
    setPlaceholderIndex(index);
  }, 0);
}

export function handleDragEnd(e: React.DragEvent<HTMLLIElement>): void {
  if (e.dataTransfer.dropEffect === 'none') {
    e.currentTarget.classList.remove(cardStyle.card__dragging);
  }
}

export function handleDragOver(
  e: React.DragEvent<HTMLUListElement>,
  list: IList,
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>
): void {
  e.preventDefault();
  if (list.cards.length === 0) {
    setPlaceholderIndex(list.cards.length);
  }
  const targetElement = (e.target as HTMLElement).closest('li') as HTMLLIElement;
  if (!targetElement) {
    const isSourceList = e.currentTarget.querySelector(`.${cardStyle.card__dragging}`);
    if (list.cards.length === 1 && isSourceList) {
      setPlaceholderIndex(0);
    }
    return;
  }
  const currentIndex = Number(targetElement?.dataset.index);
  const currentElementCoord = targetElement.getBoundingClientRect();
  const currentElementCenter = currentElementCoord.top + currentElementCoord.height / 2;
  if (e.clientY <= currentElementCenter) {
    setPlaceholderIndex(currentIndex);
  } else if (e.clientY > currentElementCenter) {
    setPlaceholderIndex(currentIndex + 1);
  }
}

export function handleDragLeave(
  e: React.DragEvent<HTMLUListElement>,
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>
): void {
  if (e.currentTarget.contains(e.relatedTarget as Node)) {
    return;
  }
  setPlaceholderIndex(null);
}

export async function handleDrop(
  e: React.DragEvent<HTMLUListElement>,
  placeholderIndex: number | null,
  list: IList,
  boardId: string | undefined,
  onRefresh: () => Promise<void>,
  setPlaceholderIndex: React.Dispatch<React.SetStateAction<number | null>>,
  setLists: React.Dispatch<React.SetStateAction<IList[]>>
): Promise<void> {
  if (placeholderIndex === null) return;
  const cardId = Number(e.dataTransfer.getData('cardId'));
  const listId = Number(e.dataTransfer.getData('sourceListId'));
  const cardTitle = e.dataTransfer.getData('cardTitle');
  const originalCard = document.querySelector(`li[data-id="${cardId}"]`);
  try {
    const currentCards = [...list.cards];
    let cardsForUpdate = currentCards;
    let finalIndex = placeholderIndex;
    if (listId === list.id) {
      const originalIndex = currentCards.findIndex((c) => c.id === cardId);
      if (originalIndex < placeholderIndex) {
        finalIndex = placeholderIndex - 1;
      }
      if (originalIndex === finalIndex) {
        if (originalCard) {
          originalCard.classList.remove(cardStyle.card__dragging);
        }
        setPlaceholderIndex(null);
        return;
      }
      cardsForUpdate = currentCards.filter((c) => c.id !== cardId);
    }
    const moveCard = { id: cardId, title: cardTitle };
    cardsForUpdate.splice(finalIndex, 0, moveCard);
    setLists((prevLists) =>
      prevLists.map((l) => {
        if (l.id === list.id) {
          return { ...l, cards: cardsForUpdate };
        }
        return l;
      })
    );
    setPlaceholderIndex(null);
    const updateList = cardsForUpdate.map((card, index) => ({
      id: card.id,
      position: index + 1,
      list_id: list.id,
    }));
    await instance.put(`/board/${boardId}/card`, updateList);
    if (listId === list.id) {
      if (originalCard) {
        originalCard.classList.remove(cardStyle.card__dragging);
      }
    }
    if (listId !== list.id) {
      const oldList = document.querySelector(`[data-id="${listId}"]`) as HTMLUListElement;
      const oldCards = Array.from(oldList?.querySelectorAll('li'));
      const oldListPos = oldCards
        .map((li) => Number(li.dataset.id))
        .filter((id) => id !== cardId)
        .map((id, index) => ({
          id,
          position: index + 1,
          list_id: listId,
        }));
      await instance.put(`/board/${boardId}/card`, oldListPos);
    }
    onRefresh();
  } catch (error) {
    toastrError('Помилка при спробі змінити дані', 'Помилка');
  }
  setPlaceholderIndex(null);
}
