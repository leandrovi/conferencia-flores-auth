import { useRef, useEffect, InputHTMLAttributes } from "react";
import { useField } from "@unform/core";

import styles from "./styles.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?:
    | "text"
    | "number"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "hidden"
    | "month"
    | "password"
    | "time"
    | "range"
    | "search"
    | "tel"
    | "url"
    | "week";
  label?: string;
  value?: string;
  clearAuthError: () => void;
}

export function Input({
  name,
  type,
  label,
  value,
  clearAuthError,
  ...rest
}: InputProps) {
  const inputRef = useRef(null);
  const { fieldName, defaultValue, registerField, error, clearError } =
    useField(name);

  const defaultInputValue = value || defaultValue;

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, newValue) => {
        ref.current.value = newValue;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className={styles.container}>
      <label htmlFor={fieldName}>{label}</label>

      <input
        type={type || "text"}
        id={fieldName}
        ref={inputRef}
        defaultValue={defaultInputValue}
        className={styles.input}
        onFocus={() => {
          clearError();
          clearAuthError();
        }}
        {...rest}
      />

      {error && <span>{error}</span>}
    </div>
  );
}
