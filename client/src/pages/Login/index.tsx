import React, { useRef, useState } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

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
  const [authError, setAuthError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  async function handleSubmit(data: SubmitHandler<FormData>) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("O e-mail precisa ser um e-mail válido")
          .required("Por favor, digite um e-mail válido"),
        password: Yup.string()
          .min(6, "A senha deve conter 6 dígitos")
          .required("Por favor, digite a senha enviada por e-mail"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      console.log(data);
      // window.location.href = "https://adai.online.church/";
    } catch (err) {
      const validationErrors: { [path: string]: string } = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path as string] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      } else {
        if (errorCount < 3) {
          setErrorCount(errorCount + 1);
          setAuthError(true);
        }
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={leftBg} alt="Flower" />
      </div>

      <div className={styles.content}>
        <img src={welcome} alt="Bem vindas" />

        <Form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <Input
            name="email"
            type="text"
            placeholder="Digite o seu e-mail"
            clearAuthError={() => setAuthError(false)}
          />

          <Input
            name="password"
            type="password"
            placeholder="Digite a sua senha"
            clearAuthError={() => setAuthError(false)}
          />

          {authError && (
            <span className={styles.error}>
              Seu e-mail e/ou senha estão incorretos, tente novamente
            </span>
          )}

          {errorCount >= 3 && (
            <span className={styles.error}>
              Caso você esteja com dificuldades para acessar, envie um e-mail
              para contato@adai.com.br para que possamos ajudá-la
            </span>
          )}

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
