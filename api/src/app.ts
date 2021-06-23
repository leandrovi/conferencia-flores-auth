import express from "express";
import cors from "cors";

import { LoginController } from "./app/controllers/login.controller";

const app = express();
const loginController = new LoginController();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", loginController.login);
app.post("/login/seed", loginController.seed);

export default app;
