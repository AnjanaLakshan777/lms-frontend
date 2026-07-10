import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8080/lms/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});