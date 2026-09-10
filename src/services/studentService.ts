import axios from "./axios";
import type { User } from "../types/user";

export const getStudents = () => {
  return axios.get("/users").then((response) => {
    return {
      ...response,
      data: response.data.filter((user: User) => user.role === "STUDENT"),
    };
  });
};