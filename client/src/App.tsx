import React from "react";
import { Login } from "./pages/Login";
import { CookiesProvider } from "react-cookie";

import "./fonts/linowrite.ttf";
import "./styles/global.css";

function App() {
  return (
    <CookiesProvider>
      <Login />
    </CookiesProvider>
  );
}

export default App;
