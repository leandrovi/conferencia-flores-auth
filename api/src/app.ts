import express from "express";
import cors from "cors";

import { LoginController } from "./app/controllers/login.controller";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const loginController = new LoginController();

// Routes and methods
app.get("/login", loginController.login);

// Export the application to be passed into the serverless framework
export default app;
