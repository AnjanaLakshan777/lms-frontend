import axios from "./axios";
import type { Lesson } from "../types/lesson";

export type CreateLessonRequest = Omit<Lesson, "lessonId" | "moduleCode">;

export const getLessons = async() => {
    return await axios.get("/lessons");
};

export const saveLesson = async (lesson: CreateLessonRequest) => {
    const response = await axios.post("/lessons", lesson);

    return response.data;
};