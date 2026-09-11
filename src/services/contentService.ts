import axios from "./axios";

export const getContents = () => {
    return axios.get("/contents");
}