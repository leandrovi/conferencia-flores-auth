import React, { useRef } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import { Input } from "../../components/Input";

import leftBg from "../../assets/left-bg.png";
import rightBg from "../../assets/right-bg.png";
import welcome from "../../assets/welcome.png";

import styles from "./styles.module.css";

interface FormData {
  name: string;
  email: string;
}

export function Login() {
  const formRef = useRef<FormHandles>(null);

  function handleSubmit(data: SubmitHandler<FormData>) {
    console.log(formRef);
    // window.location.href = "https://adai.online.church/";
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={leftBg} alt="Flower" />
      </div>

      <div className={styles.content}>
        <img src={welcome} alt="Bem vindas" />

        <Form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <Input name="email" type="email" placeholder="Digite o seu e-mail" />

          <Input
            name="password"
            type="password"
            placeholder="Digite a sua senha"
          />

          <button type="submit" className={styles.button}>
            entrar
          </button>
        </Form>
      </div>

      <div className={styles.rightSide}>
        <img src={rightBg} alt="Flower" />
      </div>
    </div>
  );
}
