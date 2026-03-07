import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import loginStyle from './login.module.scss';

export function Login(): JSX.Element {
  return (
    <div className={loginStyle.container}>
      <form>
        <h2>Авторизація</h2>
        <div className={loginStyle.info}>
          <label htmlFor="email">Email:</label>
          <input type="email" placeholder="Введіть електронну пошту" />
        </div>
        <div className={loginStyle.info}>
          <label htmlFor="password">Пароль:</label>
          <input type="password" placeholder=" Введіть пароль" />
        </div>
        <button>Увійти</button>
        <p>
          Немає аккаунту? <Link to="/register">Зареєструватися</Link>
        </p>
      </form>
    </div>
  );
}
