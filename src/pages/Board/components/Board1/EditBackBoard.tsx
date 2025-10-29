import { ChangeEvent, JSX, useEffect, useState } from 'react';
import instance from '../../../../api/request';
import homeStyle from '../../../Home/home.module.scss';

interface props {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  boardId: string | undefined;
  defaultValue: string;
  onCardCreated: () => Promise<void>;
  setAction: React.Dispatch<React.SetStateAction<string>>;
}

export function EditBackBoard({ dialogRef, boardId, defaultValue, onCardCreated, setAction }: props): JSX.Element {
  const [inputColor, setInputColor] = useState(defaultValue);

  const closeDialog = (): void => {
    dialogRef.current?.close();
    setAction('');
  };

  const handleColor = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputColor(event.target.value);
  };

  const editBackground = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      await instance.put(`/board/${boardId}`, { custom: { background: inputColor } });
      onCardCreated();
      closeDialog();
      // eslint-disable-next-line no-console
      console.log('ggg');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <dialog ref={dialogRef} className={homeStyle.home__dialog}>
      <h2 className={homeStyle.home__dialog__header}>Редагування фону дошки</h2>
      <form onSubmit={editBackground}>
        <label className={homeStyle.home__dialog__form}>
          Колір Фону:
          <input type="color" value={inputColor} onChange={handleColor} className={homeStyle.home__dialog__input} />
        </label>
        <div className={homeStyle.home__dialog__buttons}>
          <button type="submit" className={homeStyle.home__dialog__button}>
            Надіслати
          </button>
          <button type="button" onClick={closeDialog} className={homeStyle.home__dialog__button}>
            Закрити
          </button>
        </div>
      </form>
    </dialog>
  );
}
