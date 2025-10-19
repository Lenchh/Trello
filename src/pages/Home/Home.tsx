import { JSX, useEffect, useRef, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { BoardHome } from './components/BoardHome';
import instance from '../../api/request';
import homeStyle from './home.module.scss';
import { IBoard } from '../../common/interfaces/IBoard';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [errorText, setErrorText] = useState<string>('');
  const [errorCreateBoard, setErrorCreateBoard] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const dialogRef = useRef<HTMLDialogElement>(null);
  const openDialog = (): void => {
    setInputValue('');
    setErrorCreateBoard('');
    dialogRef.current?.showModal();
  };
  const closeDialog = (): void => dialogRef.current?.close();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (/^[a-zA-Zа-щА-ЩіІїЇєЄґҐ0-9 ,._-]*$/.test(event.target.value)) {
      setInputValue(event.target.value);
    }
  };
  const createBoard = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    if (inputValue.trim() === '') {
      setErrorCreateBoard("Ім'я дошки не повинно бути пустим.");
      return;
    }
    try {
      await instance.post('/board', { id: Date.now(), title: inputValue, custom: { background: 'darksalmon' } });
      const res = await instance.get('/board');
      setBoards(res.data.boards);
      closeDialog();
    } catch (error) {
      setErrorText('Помилка при створенні дошки.');
    }
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await instance.get('/board');
        setBoards(res.data.boards);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setErrorText('Помилка при завантаженні дошок');
      }
    };
    fetchData();
  }, []);

  const arrayBoards = boards?.map((board) => (
    <Link to={`/board/${board.id}`} key={board.id}>
      <BoardHome props={board} />
    </Link>
  ));

  return (
    <div className={homeStyle.home}>
      <h1 className={homeStyle.home__header}>Мої дошки</h1>
      {errorText && (
        <div className={homeStyle.home__header} style={{ color: 'red' }}>
          {errorText}
        </div>
      )}
      <div className={homeStyle.home__boards}>
        {arrayBoards}
        <button type="button" className={homeStyle.home__button} onClick={openDialog}>
          + Створити дошку
        </button>
      </div>

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
    </div>
  );
}
