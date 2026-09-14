import axios from "./axios";
import type { Module } from "../types/module";

export type CreateModuleRequest = Omit<Module, "moduleId" | "courseCode">;

export const getModules = async() => {
    return await axios.get("/modules");
};

export const saveModule = async (module: CreateModuleRequest) => {
    const response = await axios.post("/modules", module);

    return response.data;
};

export const updateModule = async (module: Module) => {
    const response = await axios.put(`/modules/${module.moduleId}`, {
        moduleCode: module.moduleCode,
        moduleName: module.moduleName,
        description: module.description,
        courseId: module.courseId,
    });

    return response.data;
};