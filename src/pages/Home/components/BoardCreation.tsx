import { ChangeEvent, JSX, useRef, useState } from 'react';
import homeStyle from '../home.module.scss';
import { toastrInfo } from '../../../common/toastr/info/toastr-options-info';
import { useAppDispatch } from '../../../featchers/hooks';
import { createBoard } from '../../../featchers/slices/boardSlice';

interface props {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onRefresh: () => Promise<void>;
}

export function BoardCreation({ dialogRef, onRefresh }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState<string>('');
  const [inputBackground, setInputBackground] = useState<string>('#136CF1');
  const [selectedOption, setSelectedOption] = useState('color');
  const imageBackgroundRef = useRef<HTMLInputElement>(null);
  const [nameFile, setNameFile] = useState('');

  const closeDialog = (): void => {
    if (imageBackgroundRef.current) imageBackgroundRef.current.value = '';
    setInputValue('');
    setNameFile('');
    setInputBackground('#136CF1');
    dialogRef.current?.close();
  };

  const createBoardData = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      toastrInfo("Ім'я дошки не повинно бути пустим", 'Інформація');
      return;
    }
    try {
      await dispatch(createBoard({ inputValue, inputBackground })).unwrap();
      onRefresh();
      closeDialog();
    } catch (error) {
      console.log('error with creation board.');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 `,._-]*$/.test(event.target.value)) {
      setInputValue(event.target.value);
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
      setNameFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <dialog ref={dialogRef} className={homeStyle.home__dialog}>
      <h2 className={homeStyle.home__dialog__header}>Створення дошки</h2>
      <form onSubmit={createBoardData}>
        <label className={homeStyle.home__dialog__form}>
          Ім'я дошки:
          <input type="text" value={inputValue} onChange={handleChange} className={homeStyle.home__dialog__input} />
        </label>
        <div className={homeStyle.home__dialog__form}>
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
            <>
              <input
                key="image"
                ref={imageBackgroundRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className={homeStyle.custom_file_input}
              />
              {nameFile && <img src={nameFile} alt="" className={homeStyle.imgBack} />}
            </>
          )}
        </div>
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
