import axios from "axios";
import { AUTH_API_URL } from "../contants";

export const api = axios.create({
  baseURL: AUTH_API_URL,
});
