import { ChangeEvent, JSX } from 'react';
import instance from '../../../../api/request';
import editBoardName from './editBoardName.module.scss';
import { toastrError } from '../../../../common/toastr/error/toastr-options-error';
import { toastrSuccess } from '../../../../common/toastr/success/toastr-options-success';
import { toastrInfo } from '../../../../common/toastr/info/toastr-options-info';

interface props {
  onRefresh: () => Promise<void>;
  idBoard: string | undefined;
  setInput: React.Dispatch<React.SetStateAction<boolean>>;
  nameBoard: string;
  setNameBoard: React.Dispatch<React.SetStateAction<string>>;
  oldValue: string;
}

export function EditBoardName({ onRefresh, idBoard, setInput, nameBoard, setNameBoard, oldValue }: props): JSX.Element {
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
      await instance.put(`/board/${idBoard}`, { title: nameBoard });
      onRefresh();
      setInput(false);
      toastrSuccess('Дані успішно змінені', 'Успіх');
    } catch (error) {
      setInput(false);
      setNameBoard(oldValue);
      toastrError('Помилка при спробі змінити дані', 'Помилка');
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
