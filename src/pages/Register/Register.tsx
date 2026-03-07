import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import loginStyle from '../Login/login.module.scss';

export function Register(): JSX.Element {
  return (
    <div className={loginStyle.container}>
      <form>
        <h2>Реєстрація</h2>
        <div className={loginStyle.info}>
          <label htmlFor="email">Email:</label>
          <input type="email" placeholder="Введіть електронну пошту" />
        </div>
        <div className={loginStyle.info}>
          <label htmlFor="password">Пароль:</label>
          <input type="password" placeholder=" Введіть пароль" />
        </div>
        <div className={loginStyle.info}>
          <label htmlFor="password">Повторіть пароль:</label>
          <input type="password" placeholder="Повторіть пароль" />
        </div>
        <button>Зареєструватися</button>
        <p>
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  );
}
