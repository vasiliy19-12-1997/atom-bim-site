import { FC } from "react";
import s from "./AuthPage.module.scss";
import { AtomButton } from "../UI/AtomButton/AtomButton";
export const AuthPage: FC = () => {
  return (
    <div className={s.AuthPage}>
      <h2>Вход</h2>
      <form action="/login" method="POST" className={s.AuthPageForm}>
        <label htmlFor="username">Имя пользователя</label>
        <input type="text" id="username" name="username" required />
        <label htmlFor="password">Имя пользователя</label>
        <input type="text" id="password" name="password" required />
        <AtomButton type="submit" onClick={() => console.log("")} key="">
          Войти
        </AtomButton>
      </form>
    </div>
  );
};
