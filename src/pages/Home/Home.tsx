import { JSX, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoardHome } from './components/BoardHome';
import { BoardCreation } from './components/BoardCreation';
import instance from '../../api/request';
import homeStyle from './home.module.scss';
import { IBoard } from '../../common/interfaces/IBoard';
import { toastrError } from '../../common/toastr/error/toastr-options-error';

export function Home(): JSX.Element {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [creationForm, openCreationForm] = useState(false);
  const navigate = useNavigate();

  const logOut = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const openDialog = (): void => {
    openCreationForm(true);
  };

  const fetchData = async (): Promise<void> => {
    try {
      const res = await instance.get('/board');
      setBoards(res.data.boards);
    } catch (error) {
      toastrError('Помилка при завантаженні дошок', 'Помилка');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const arrayBoards = boards?.map((board) => (
    <Link to={`/board/${board.id}`} key={board.id}>
      <BoardHome props={board} />
    </Link>
  ));

  return (
    <div className={homeStyle.home}>
      <div className={homeStyle.header}>
        <h1>Мої дошки</h1>
        <button onClick={logOut}>Вийти</button>
      </div>
      <div className={homeStyle.boards}>
        {arrayBoards}
        <button type="button" className={homeStyle.createBoardButton} onClick={openDialog}>
          +<br /> Створити дошку
        </button>
      </div>
      {creationForm && <BoardCreation onRefresh={fetchData} openCreationForm={openCreationForm} />}
    </div>
  );
}
