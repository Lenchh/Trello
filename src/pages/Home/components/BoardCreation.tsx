import { ChangeEvent, JSX, useState } from 'react';
import instance from '../../../api/request';
import homeStyle from '../home.module.scss';

interface props {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  errorCreateBoard: string;
  setErrorCreateBoard: React.Dispatch<React.SetStateAction<string>>;
  onCardCreated: () => Promise<void>;
}

export function BoardCreation({ dialogRef, errorCreateBoard, setErrorCreateBoard, onCardCreated }: props): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputColor, setInputColor] = useState<string>('#136CF1');

  const closeDialog = (): void => {
    setInputValue('');
    setInputColor('#136CF1');
    dialogRef.current?.close();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setInputValue(event.target.value);
    }
  };

  const handleColor = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputColor(event.target.value);
  };

  const createBoard = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorCreateBoard("Ім'я дошки не повинно бути пустим.");
      return;
    }
    try {
      await instance.post('/board', { id: Date.now(), title: inputValue, custom: { background: inputColor } });
      onCardCreated();
      closeDialog();
    } catch (error) {
      setErrorCreateBoard('Помилка при створенні дошки.');
    }
  };

  return (
    <dialog ref={dialogRef} className={homeStyle.home__dialog}>
      <h2 className={homeStyle.home__dialog__header}>Створення дошки</h2>
      {errorCreateBoard && (
        <div className={homeStyle.home__header} style={{ color: 'red' }}>
          {errorCreateBoard}
        </div>
      )}
      <form onSubmit={createBoard}>
        <label className={homeStyle.home__dialog__form}>
          Ім'я дошки:
          <input type="text" value={inputValue} onChange={handleChange} className={homeStyle.home__dialog__input} />
        </label>
        {/* <label className={homeStyle.home__dialog__form}>
          Колір Фону:
          <input type="color" value={inputColor} onChange={handleColor} className={homeStyle.home__dialog__input} />
        </label> */}
        <label className={homeStyle.home__dialog__form}>
          Колір Фону:<br/>
          <label>
            <input
              type="radio"
              name="boardAction"
              value="delete"
              onChange={handleChange}
            />
            Колір
          </label>

          <label>
            <input
              type="radio"
              name="boardAction"
              value="changeBg"
              onChange={handleChange}
            />
            Зображення
          </label>
        </label>
        <div className={homeStyle.home__dialog__buttons}>
          <button type="submit" className={homeStyle.home__dialog__button}>
            Надіслати
          </button>
          <button onClick={closeDialog} className={homeStyle.home__dialog__button}>
            Закрити
          </button>
        </div>
      </form>
    </dialog>
  );
}
