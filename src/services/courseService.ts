import axios from "./axios";
import type { Course } from "../types/course";

export type CreateCourseRequest = Omit<Course, "courseId">;

export const getCourses = async() => {
  return await axios.get("/courses");
};

export const saveCourse = async (course: CreateCourseRequest) => {
  const response = await axios.post("/courses", course);

  return response.data;
};
