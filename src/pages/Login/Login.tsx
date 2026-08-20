import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { validate } from 'email-validator';
import { toastrSuccess } from '../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../common/toastr/error/toastr-options-error';
import loginStyle from './login.module.scss';

export function Login(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isEmptyInputPassword = !password && isSubmitted;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate(email)) {
      toastrError('Перевірте коректність введеної електронної пошти.', 'Некоректні дані');
      return;
    }
    if (!password) {
      toastrError('Введіть коректний пароль.', 'Некоректні дані');
      return;
    }
    toastrSuccess('eee', 'eee');
  };
  return (
    <div className={loginStyle.container}>
      <form onSubmit={handleSubmit}>
        <h2>Авторизація</h2>
        <div className={loginStyle.info}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            placeholder="Введіть електронну пошту"
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
            style={(email || isSubmitted) && !validate(email) ? { borderColor: 'red' } : { borderColor: '#136cf1' }}
          />
        </div>
        <div className={loginStyle.info}>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            placeholder=" Введіть пароль"
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
            style={isEmptyInputPassword ? { borderColor: 'red' } : { borderColor: '#136cf1' }}
          />
          {isEmptyInputPassword && <p style={{ color: 'red' }}>Поле для введення пароля не може бути пустим.</p>}
        </div>
        <button type="submit">Увійти</button>
        <p>
          Немає аккаунту? <Link to="/register">Зареєструватися</Link>
        </p>
      </form>
    </div>
  );
}
