import { ChangeEvent, Dispatch, JSX, SetStateAction, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import editBackStyle from '../../../Home/components/boardCreation.module.scss';
import { useAppDispatch } from '../../../../featchers/hooks';
import { editBackgroundBoard } from '../../../../featchers/slices/boardSlice';

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
    <div className={editBackStyle.modal} onClick={clickToClose}>
      <div className={editBackStyle.dialogWindow}>
        <h2 className={editBackStyle.header}>Редагування фону дошки</h2>
        <form onSubmit={editBackground}>
          <div className={editBackStyle.form}>
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
                className={editBackStyle.input}
              />
            ) : (
              <>
                <input
                  key="image"
                  ref={imageBackgroundRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className={editBackStyle.customFileInput}
                />
                {nameFile && <img src={nameFile} alt="" className={editBackStyle.previewBackground} />}
              </>
            )}
          </div>
          <div className={editBackStyle.dialogActions}>
            <button type="submit" className={editBackStyle.action}>
              Надіслати
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
