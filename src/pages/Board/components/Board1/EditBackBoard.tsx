import { ChangeEvent, JSX, useRef, useState } from 'react';
import instance from '../../../../api/request';
import homeStyle from '../../../Home/home.module.scss';

interface props {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  boardId: string | undefined;
  defaultValue: string;
  onRefresh: () => Promise<void>;
  setAction: React.Dispatch<React.SetStateAction<string>>;
}

export function EditBackBoard({ dialogRef, boardId, defaultValue, onRefresh, setAction }: props): JSX.Element {
  const [inputBackground, setInputBackground] = useState(defaultValue);
  const [selectedOption, setSelectedOption] = useState('color');
  const imageBackgroundRef = useRef<HTMLInputElement>(null);

  const closeDialog = (): void => {
    if (imageBackgroundRef.current) imageBackgroundRef.current.value = '';
    dialogRef.current?.close();
    setAction('');
  };

  const editBackground = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      await instance.put(`/board/${boardId}`, { custom: { background: inputBackground } });
      onRefresh();
      closeDialog();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const changeOption = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedOption(event.target.value);
  };

  const handleColor = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputBackground(event.target.value);
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (): void => {
      setInputBackground(reader.result as string);
    };
    reader.readAsDataURL(file);
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
              value={inputBackground}
              onChange={handleColor}
              className={homeStyle.home__dialog__input}
            />
          ) : (
            <input key="image" ref={imageBackgroundRef} type="file" accept="image/*" onChange={handleImage} />
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
