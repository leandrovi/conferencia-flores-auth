import React from "react";

import styles from "./styles.module.css";
import logo from "../../assets/logo.png";

export function AppLoader() {
  return (
    <div className={styles.container}>
      <img src={logo} alt="ADAI" />
    </div>
  );
}
