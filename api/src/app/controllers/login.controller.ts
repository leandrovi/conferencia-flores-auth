import { Request, Response } from "express";

export class LoginController {
  async login(request: Request, response: Response) {
    console.log("login");
    return response.status(200).json({ ok: true });
  }
}
