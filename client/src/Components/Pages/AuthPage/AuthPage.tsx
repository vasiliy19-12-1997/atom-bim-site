import { FC, useState } from "react";
import s from "./AuthPage.module.scss";
import { AtomInput } from "../../UI/AtomInput/AtomInput";
import { AtomButton } from "../../UI/AtomButton/AtomButton";

export const AuthPage: FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className={s.AuthPage}>
      <h2>Вход</h2>
      <form action="/login" method="POST" className={s.AuthPageForm}>
        <label htmlFor="username">Имя пользователя</label>
        <AtomInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=""
          module="submit"
          type="text"
          id="username"
          name="username"
          required
        />
        <label htmlFor="password">Пароль</label>
        <AtomInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=""
          module="submit"
          type="password"
          id="password"
          name="password"
          required
        />
        <AtomButton type="submit" onClick={() => console.log("")} key="">
          Войти
        </AtomButton>
      </form>
    </div>
  );
};
