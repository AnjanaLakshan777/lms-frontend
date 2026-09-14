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

export const updateStudent = async (student: User) => {
  const response = await axios.put(`/users/${student.id}`, {
    firstName: student.firstName,
    lastName: student.lastName,
    addressLine1: student.addressLine1,
    addressLine2: student.addressLine2,
    addressLine3: student.addressLine3,
    city: student.city,
    email: student.email,
    phoneNumber: student.phoneNumber,
    password: student.password,
    role: "STUDENT",
  });

  return response.data;
};