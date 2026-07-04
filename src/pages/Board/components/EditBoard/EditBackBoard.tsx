import { ChangeEvent, Dispatch, JSX, SetStateAction, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import editBackStyle from '../../../Home/components/boardCreation.module.scss';
import { useAppDispatch } from '../../../../featchers/hooks';
import { editBackgroundBoard } from '../../../../featchers/slices/boardSlice';
import colorButton from '../../../../assets/colorButton.svg';
import colorButtonActive from '../../../../assets/colorButtonActive.svg';
import imageButton from '../../../../assets/imageButton.svg';
import imageButtonActive from '../../../../assets/imageButtonActive.svg';

interface props {
  defaultValue: string;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  openBackForm: Dispatch<SetStateAction<boolean>>;
}

export function EditBackBoard({ defaultValue, setAction, openBackForm }: props): JSX.Element {
  const dispatch = useAppDispatch();
  const { boardId } = useParams();
  const [inputBackground, setInputBackground] = useState(defaultValue);
  const [selectedOption, setSelectedOption] = useState('color');
  const imageBackgroundRef = useRef<HTMLInputElement>(null);
  const [nameFile, setNameFile] = useState('');
  const pastelBackgrounds = ['#568b9e', '#cb938f', '#bede8b', '#fbd072', '#C3B1E1', '#8bb8a7', '#ed7085', '#337849'];

  const closeDialog = (): void => {
    if (imageBackgroundRef.current) imageBackgroundRef.current.value = '';
    openBackForm(false);
    setNameFile('');
    setAction('');
  };

  function clickToClose(event: React.MouseEvent<HTMLDivElement>): void {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  const editBackground = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    try {
      if (boardId) {
        await dispatch(editBackgroundBoard({ boardId, inputBackground })).unwrap();
        closeDialog();
      }
    } catch (er) {
      console.log('error with editing background of board.');
    }
  };

  const handleColor = (event: string): void => {
    setInputBackground(event);
    setNameFile('');
  };

  const handleInputColor = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputBackground(event.target.value);
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
    <div className={editBackStyle.modal} onClick={clickToClose}>
      <div className={editBackStyle.dialogWindow}>
        <h2 className={editBackStyle.header}>Редагування фону дошки</h2>
        <form onSubmit={editBackground}>
          <div className={editBackStyle.customControl}>
            <button
              className={selectedOption === 'color' ? editBackStyle.active : ''}
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
              className={selectedOption === 'image' ? editBackStyle.active : ''}
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
            <div className={editBackStyle.colorsBackground}>
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
                  className={`${editBackStyle.colorButton} ${inputBackground === color ? editBackStyle.activeColorButton : ''}`}
                />
              ))}
              <input
                key="color"
                type="color"
                value={inputBackground}
                onChange={handleInputColor}
                className={editBackStyle.colorInputButton}
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
              className={editBackStyle.customFileInput}
            />
          )}
          <div className={editBackStyle.dialogActions}>
            <button type="submit" className={editBackStyle.action}>
              Створити дошку
            </button>
            <button type="button" onClick={closeDialog} className={editBackStyle.action}>
              Закрити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
