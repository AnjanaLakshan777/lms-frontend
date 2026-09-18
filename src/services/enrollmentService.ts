import axios from "./axios";
import type { Enrollment } from "../types/enrollment"

export type CreateEnrollmentRequest = Omit<Enrollment, "enrollmentId" | "courseName" | "enrolledAt">

export const saveEnrollment = async(enrollment: CreateEnrollmentRequest) => {
    const response = await axios.post("/enrollment",enrollment);
    return response;
}