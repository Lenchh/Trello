import { ChangeEvent, JSX } from 'react';
import { useParams } from 'react-router-dom';
import listStyle from './list.module.scss';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';
import { useAppDispatch } from '../../../../featchers/hooks';
import { editTitleList } from '../../../../featchers/slices/boardSlice';

interface props {
  listId: number;
  setIsNameList: React.Dispatch<React.SetStateAction<boolean>>;
  nameList: string;
  setNameList: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string;
}

export function EditNameList({ listId, setIsNameList, nameList, setNameList, oldValue }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setNameList(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (nameList.trim() === '') {
      toastrInfo("Ім'я списку не може бути пустим", 'Інформація');
      return;
    }
    if (nameList.trim() === oldValue) {
      setIsNameList(true);
      return;
    }
    try {
      if (boardId) await dispatch(editTitleList({ boardId, listId, nameList })).unwrap();
    } catch (error) {
      setNameList(oldValue || 'Default name');
    } finally {
      setIsNameList(true);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      editName();
    }
  };

  return (
    <input
      type="text"
      value={nameList}
      className={listStyle.list__input}
      onChange={handleChange}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
