import axios from "./axios";
import type { User } from "../types/user";

export type CreateStudentRequest = Omit<User, "id">;

export const getStudents = async () => {
  const response = await axios.get("/users");

  return {
    ...response,
    data: response.data.filter((user: User) => user.role === "STUDENT"),
  };
};

export const saveStudent = async (student: CreateStudentRequest) => {
  const response = await axios.post("/users", {
    ...student,
    role: "STUDENT",
  });

  return response.data;
};