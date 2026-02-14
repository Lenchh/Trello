import { ChangeEvent, JSX } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../../featchers/hooks';
import editBoardName from './editBoardName.module.scss';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';
import { editTitleBoard } from '../../../../featchers/slices/boardSlice';

interface props {
  setInput: React.Dispatch<React.SetStateAction<boolean>>;
  nameBoard: string;
  setNameBoard: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string;
}

export function EditBoardName({ setInput, nameBoard, setNameBoard, oldValue }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setNameBoard(event.target.value);
    }
  };

  const editName = async (): Promise<void> => {
    if (nameBoard.trim() === '') {
      toastrInfo('Ім`я дошки не повинно бути пустим', 'Інформація');
      return;
    }
    if (nameBoard.trim() === oldValue) {
      setInput(false);
      return;
    }
    try {
      if (boardId) {
        await dispatch(editTitleBoard({ boardId, nameBoard })).unwrap();
      }
    } catch (error) {
      setNameBoard(oldValue);
    } finally {
      setInput(false);
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
      value={nameBoard}
      onChange={handleChange}
      className={editBoardName.input}
      onBlur={editName}
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
    />
  );
}
