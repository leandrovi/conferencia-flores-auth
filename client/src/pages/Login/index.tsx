import React, { useRef } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";

import Input from "../../components/Input";

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
    <div>
      <h1>Faça seu login aqui mulherada!</h1>
      <h2>Toma aqui um girassol: 🌻</h2>

      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input label="email" name="email" />
        <Input label="senha" name="password" />

        <button type="submit">entrar</button>
      </Form>
    </div>
  );
}
