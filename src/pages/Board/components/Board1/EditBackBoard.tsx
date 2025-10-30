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
  const [selectedOption, setSelectedOption] = useState('color');

  const changeOption = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedOption(event.target.value);
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (): void => {
      setInputColor(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
          <br />
          <label>
            <input
              type="radio"
              name="boardAction"
              value="color"
              checked={selectedOption === 'color'}
              onChange={changeOption}
            />
            Колір
          </label>
          <label>
            <input
              type="radio"
              name="boardAction"
              value="image"
              checked={selectedOption === 'image'}
              onChange={changeOption}
            />
            Зображення
          </label>
          <br />
          {selectedOption === 'color' ? (
            <input
              key="color"
              type="color"
              value={inputColor}
              onChange={handleColor}
              className={homeStyle.home__dialog__input}
            />
          ) : (
            <input key="image" type="file" accept="image/*" onChange={handleImage} />
          )}
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
