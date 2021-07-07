import React from "react";
import { CookiesProvider } from "react-cookie";

import "./fonts/linowrite.ttf";
import "./styles/global.css";
import { Routes } from "./routes";

function App() {
  return (
    <CookiesProvider>
      <Routes />
    </CookiesProvider>
  );
}

export default App;
