import axios from "./axios";

export const getModules = () => {
    return axios.get("/modules");
};