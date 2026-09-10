export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    password: string;
    role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}