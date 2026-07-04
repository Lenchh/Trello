import { ChangeEvent, Dispatch, JSX, MouseEventHandler, SetStateAction, useRef, useState } from 'react';
import boardCreateStyle from './boardCreation.module.scss';
import { toastrInfo } from '../../../common/toastr/info/toastr-options-info';
import { useAppDispatch } from '../../../featchers/hooks';
import { createBoard } from '../../../featchers/slices/boardSlice';
import colorButton from '../../../assets/colorButton.svg';
import colorButtonActive from '../../../assets/colorButtonActive.svg';
import imageButton from '../../../assets/imageButton.svg';
import imageButtonActive from '../../../assets/imageButtonActive.svg';

interface props {
  onRefresh: () => Promise<void>;
  openCreationForm: Dispatch<SetStateAction<boolean>>;
}

export function BoardCreation({ onRefresh, openCreationForm }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState<string>('');
  const [inputBackground, setInputBackground] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState('color');
  const imageBackgroundRef = useRef<HTMLInputElement>(null);
  const [nameFile, setNameFile] = useState('');
  const pastelBackgrounds = ['#568b9e', '#cb938f', '#bede8b', '#fbd072', '#C3B1E1', '#8bb8a7', '#ed7085', '#337849'];

  const closeDialog = (): void => {
    if (imageBackgroundRef.current) imageBackgroundRef.current.value = '';
    setInputValue('');
    setNameFile('');
    setInputBackground('#136CF1');
    openCreationForm(false);
  };

  function clickToClose(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  const createBoardData = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      toastrInfo("Ім'я дошки не повинно бути пустим", 'Інформація');
      return;
    }
    if (inputBackground.trim() === '') {
      toastrInfo('Оберіть колір або зображення фону дошки', 'Інформація');
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

  const handleInputColor = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputBackground(event.target.value);
    setNameFile('');
  };

  const handleColor = (color: string): void => {
    setInputBackground(color);
    setNameFile('');
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
    <div className={boardCreateStyle.modal} onClick={clickToClose}>
      <div className={boardCreateStyle.dialogWindow}>
        <h2 className={boardCreateStyle.header}>Створення дошки</h2>
        <form onSubmit={createBoardData}>
          <h3>Ім'я дошки:</h3>
          <label className={boardCreateStyle.formNameBoard}>
            <input type="text" value={inputValue} onChange={handleChange} placeholder="Введіть назву дошки..." />
          </label>
          <h3>Колір або Зображення Фону:</h3>
          <div className={boardCreateStyle.customControl}>
            <button
              className={selectedOption === 'color' ? boardCreateStyle.active : ''}
              onClick={(e): void => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedOption('color');
              }}
            >
              <img src={selectedOption === 'color' ? colorButtonActive : colorButton} alt="color icon" />
              <span>Колір</span>
            </button>
            <button
              className={selectedOption === 'image' ? boardCreateStyle.active : ''}
              onClick={(e): void => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedOption('image');
              }}
            >
              <img src={selectedOption === 'image' ? imageButtonActive : imageButton} alt="" />
              <span>Зображення</span>
            </button>
          </div>
          {selectedOption === 'color' ? (
            <div className={boardCreateStyle.colorsBackground}>
              {' '}
              {pastelBackgrounds.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  aria-label={`Вибрати колір фону ${color}`}
                  onClick={(e): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColor(color);
                  }}
                  className={`${boardCreateStyle.colorButton} ${inputBackground === color ? boardCreateStyle.activeColorButton : ''}`}
                />
              ))}
              <input
                key="color"
                type="color"
                value={inputBackground}
                onChange={handleInputColor}
                className={boardCreateStyle.colorInputButton}
              />
            </div>
          ) : (
            <input
              key="image"
              style={{
                backgroundImage: nameFile ? `url(${inputBackground})` : `url(${imageButton})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              ref={imageBackgroundRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className={boardCreateStyle.customFileInput}
            />
          )}
          <div className={boardCreateStyle.dialogActions}>
            <button type="submit" className={boardCreateStyle.action}>
              Створити дошку
            </button>
            <button type="button" onClick={closeDialog} className={boardCreateStyle.action}>
              Закрити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
