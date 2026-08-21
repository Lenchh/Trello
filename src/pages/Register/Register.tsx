import { useState, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validate } from 'email-validator';
import PasswordStrengthBar from 'react-password-strength-bar';
import loginStyle from '../Login/login.module.scss';
import { toastrSuccess } from '../../common/toastr/success/toastr-options-success';
import { toastrError } from '../../common/toastr/error/toastr-options-error';
import instance from '../../api/request';

interface userInterface {
  email: string;
  password: string;
}

export function Register(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordScore, SetPasswordScore] = useState(0);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isEmptyInput = !confirmPassword && isSubmitted;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
    try {
      const userData: userInterface = {
        email,
        password,
      };
      await instance.post('/user', userData);
      toastrSuccess('Користувача успішно зареєстровано.', 'Успішна реєстрація');

      const response = await instance.post('/login', userData);
      const { token, refreshToken } = response.data;
      if (token && refreshToken) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        toastrSuccess('Користувача успішно авторизовано.', 'Успішна авторизація');
        navigate('/');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data) {
        const backendError = error.response.data.error;
        if (backendError === 'User already exists') {
          toastrError('Користувач з такою електронною поштою вже існує.', 'Помилка реєстрації');
        } else {
          toastrError(`Помилка: ${backendError}`, 'Помилка реєстрації');
        }
      } else {
        toastrError("Немає зв'язку з сервером. Перевірте підключення.", 'Помилка мережі');
      }
    }
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
            style={isSubmitted && !validate(email) ? { borderColor: 'red' } : { borderColor: '#136cf1' }}
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
