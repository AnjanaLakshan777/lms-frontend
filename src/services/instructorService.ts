import axios from "./axios";
import type { User } from "../types/user";

export type CreateInstructorRequest = Omit<User, "id">;

export const getInstructors = async () => {
  const response = await axios.get("/users");

  return {
    ...response,
    data: response.data.filter((user: User) => user.role === "INSTRUCTOR"),
  };
};

export const saveInstructor = async (
  instructor: CreateInstructorRequest,
) => {
  const response = await axios.post("/users", {
    ...instructor,
    role: "INSTRUCTOR",
  });

  return response.data;
};

export const updateInstructor = async (instructor: User) => {
  const response = await axios.put(`/users/${instructor.id}`, {
    firstName: instructor.firstName,
    lastName: instructor.lastName,
    addressLine1: instructor.addressLine1,
    addressLine2: instructor.addressLine2,
    addressLine3: instructor.addressLine3,
    city: instructor.city,
    email: instructor.email,
    phoneNumber: instructor.phoneNumber,
    password: instructor.password,
    role: "INSTRUCTOR",
  });

  return response.data;
};