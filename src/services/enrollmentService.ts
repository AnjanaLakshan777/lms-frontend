import axios from "./axios";
import type { Enrollment } from "../types/enrollment"

export type CreateEnrollmentRequest = Omit<
    Enrollment,
    "enrollId" | "courseName" | "enrolledAt"
>

export const saveEnrollment = async(enrollment: CreateEnrollmentRequest) => {
    const response = await axios.post("/enrollments",enrollment);
    return response.data;
}

export const getEnrollment = async() => {
    return axios.get("/enrollments")
}

export const deleteEnrollment = async(enrollment: Enrollment) => {
    const response = await axios.delete(`/enrollments/${enrollment.enrollId}`)
    return response;
}