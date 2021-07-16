import React, { useRef, useState, useEffect, FormEvent } from "react";
import { SubmitHandler, FormHandles, FormHelpers } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

import { sleep } from "../../utils/sleep";
import { api } from "../../services/api";
import { saveLoggedAttendee } from "../../services/storage";

import { Input } from "../../components/Input";
import { AppLoader } from "../../components/Loader";

import leftBg from "../../assets/left-bg.png";
import rightBg from "../../assets/right-bg.png";
import welcome from "../../assets/welcome.png";
import spinner from "../../assets/spinner.gif";
import libras from "../../assets/libras.png";

import styles from "./styles.module.css";
import { WPP } from "../../contants";

interface FormData {
  email: string;
  password: string;
}

export function Login() {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const [authError, setAuthError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [cookie, setCookie] = useCookies(["floresaccess"]);

  useEffect(() => {
    async function getLocalLoggedAttendee() {
      if (cookie.floresaccess) {
        console.log("Cookie found:", cookie.floresaccess);
        history.push("/escolher-trilha");
      }

      await sleep(1200);
      setLoading(false);
    }

    getLocalLoggedAttendee();
  }, [cookie.floresaccess, history]);

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

      const response = await api.post<{ exists: boolean }>("/login", data);

      if (!response.data.exists) {
        throw new Error("Attendee does not exist");
      }

      saveLoggedAttendee();

      setCookie("floresaccess", true, {
        path: "/",
        maxAge: 108000,
        domain: ".conferenciaflores.com.br",
      });

      console.log("Cookie set:", cookie);

      setTimeout(() => {
        // window.location.href = STREAMING_URL;
        setSubmitLoading(false);
        history.push("/escolher-trilha");
      }, 1300);
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

      setSubmitLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        animate={loading ? "open" : "closed"}
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
          <div className={styles.tooltip}>
            <span>
              Acessivel <br /> em libras!
            </span>

            <img src={libras} alt="Libras" id="libras" />
          </div>

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
              isPassword={true}
              clearAuthError={() => setAuthError(false)}
            />

            {authError && (
              <span className={styles.error}>
                Seu e-mail e/ou senha estão incorretos, tente novamente
              </span>
            )}

            {errorCount >= 3 && (
              <span className={styles.error}>
                Caso você esteja com dificuldades para fazer login, acesse nosso
                suporte no WhatsApp clicando{" "}
                <a href={WPP} target="_blank" rel="noreferrer">
                  aqui
                </a>
                , para que possamos ajudá-la
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
