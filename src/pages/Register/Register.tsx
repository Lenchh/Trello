import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { validate } from 'email-validator';
import PasswordStrengthBar from 'react-password-strength-bar';
import loginStyle from '../Login/login.module.scss';
import { toastrSuccess } from '../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../common/toastr/error/toastr-options-error';

interface userInterface {
  id: number;
  email: string;
  password: string;
}

export function Register(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordScore, SetPasswordScore] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isEmptyInput = !confirmPassword && isSubmitted;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!validate(email)) {
      toastrError('Перевірте коректність введеної електронної пошти.', 'Некоректні дані');
      return;
    }
    if (passwordScore < 3) {
      toastrError('Введений пароль недостатньо складний.', 'Некоректні дані');
      return;
    }
    if (password !== confirmPassword) {
      toastrError('Паролі не співпадають.', 'Некоректні дані');
      return;
    }
    const userObject: userInterface = {
      id: 1,
      email,
      password,
    };
    console.log('new user: ', userObject);
    toastrSuccess('eee', 'eee');
  };
  return (
    <div className={loginStyle.container}>
      <form onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
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
            placeholder="Введіть пароль"
            value={password}
            onChange={(e): void => setPassword(e.target.value)}
            style={(password || isSubmitted) && passwordScore < 3 ? { borderColor: 'red' } : { borderColor: '#136cf1' }}
          />
          <PasswordStrengthBar
            password={password}
            onChangeScore={(score): void => SetPasswordScore(score)}
            shortScoreWord="Занадто короткий"
            scoreWords={['Занадто короткий', 'Дуже слабкий', 'Слабкий', 'Нормальний', 'Надійний']}
            style={{ paddingTop: '10px' }}
          />
        </div>
        <div className={loginStyle.info}>
          <label htmlFor="password">Повторіть пароль:</label>
          <input
            type="password"
            placeholder="Повторіть пароль"
            value={confirmPassword}
            onChange={(e): void => setConfirmPassword(e.target.value)}
          />
          {isPasswordMismatch && <p style={{ color: 'red' }}>Паролі не співпадають!</p>}
          {isEmptyInput && <p style={{ color: 'red' }}>Поле для повторення пароля не може бути пустим.</p>}
        </div>
        <button type="submit">Зареєструватися</button>
        <p>
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  );
}
