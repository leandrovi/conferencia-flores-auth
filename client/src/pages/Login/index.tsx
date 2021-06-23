import React, { useRef, useState, useEffect, FormEvent } from "react";
import { SubmitHandler, FormHandles, FormHelpers } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "../../components/Input";
import { AppLoader } from "../../components/Loader";

import leftBg from "../../assets/left-bg.png";
import rightBg from "../../assets/right-bg.png";
import welcome from "../../assets/welcome.png";
import spinner from "../../assets/spinner.gif";

import styles from "./styles.module.css";
import { sleep } from "../../utils/sleep";
import { loadLoggedAttendee } from "../../services/storage";
import { STREAMING_URL } from "../../contants";

interface FormData {
  name: string;
  email: string;
}

export function Login() {
  const formRef = useRef<FormHandles>(null);

  const [authError, setAuthError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function getLocalLoggedAttendee() {
      const isLogged = loadLoggedAttendee();

      if (isLogged) {
        window.location.href = STREAMING_URL;
      }

      await sleep(1200);
      setLoading(false);
    }

    getLocalLoggedAttendee();
  }, []);

  async function handleSubmit(
    data: SubmitHandler<FormData>,
    _: FormHelpers,
    event?: FormEvent<Element> | undefined
  ) {
    event?.preventDefault();
    setSubmitLoading(true);

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

      setTimeout(() => {
        setSubmitLoading(false);
      }, 1000);
      // window.location.href = STREAMING_URL;
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

      setTimeout(() => {
        setSubmitLoading(false);
      }, 1000);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        animate={loading ? "open" : "closed"}
        // initial={{ opacity: 0 }}
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        exit={{ display: "none" }}
      >
        <AppLoader />
      </motion.div>

      <motion.div
        key="container"
        animate={loading === false && "show"}
        initial={{ opacity: 0 }}
        variants={{
          show: { opacity: 1 },
        }}
        className={styles.container}
      >
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

            <button
              type="submit"
              className={styles.button}
              disabled={submitLoading}
            >
              {submitLoading ? <img src={spinner} alt="Spinner" /> : "entrar"}
            </button>
          </Form>
        </div>

        <div className={styles.rightSide}>
          <img src={rightBg} alt="Flower" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
