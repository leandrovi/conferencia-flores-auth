import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { MASTERCLASS_URL, STREAMING_URL } from "../../contants";

import { AppLoader } from "../../components/Loader";

import MasterclassImg from "../../assets/masterclass.png";
import StreamingImg from "../../assets/streaming.png";

import styles from "./styles.module.css";

export function Option() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just a nice loader at the beginning
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        animate={loading ? "open" : "closed"}
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0, display: "none" },
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
        <div className={styles.option}>
          <img src={MasterclassImg} alt="Masterclass" />

          <a className={styles.buttonDisabled} href="#">
            ACESSAR
          </a>

          <a className={styles.buttonDisabled} href="#">
            ACESSAR COM LIBRAS
          </a>

          <span>
            As masterclasses serão disponibilizadas nos dias da conferência,
            aguarde
          </span>
        </div>

        <div className={styles.option}>
          <img src={StreamingImg} alt="Conferência ao vivo" />

          <a className={styles.button} href={STREAMING_URL}>
            ACESSAR
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
