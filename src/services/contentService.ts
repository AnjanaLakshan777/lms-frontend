import axios from "./axios";
import type { Content } from "../types/content";

export type CreateContentRequest = Omit<
    Content,
    "contentId" | "fileData" | "uploadAt" | "lessonCode"
> & {
    fileData: File;
};

export const getContents = async() => {
    return await axios.get("/contents");
}

export const saveContent = async (content: CreateContentRequest) => {
    const formData = new FormData();
    formData.append("contentCode", content.contentCode);
    formData.append("title", content.title);
    formData.append("type", content.type);
    formData.append("lessonId", String(content.lessonId));
    formData.append("fileData", content.fileData);

    const response = await axios.post("/contents", formData, {
        headers: {
            "Content-Type": undefined,
        },
    });

    return response.data;
};

export const updateContent = async (content: Content, fileData: File) => {
    const formData = new FormData();
    formData.append("contentCode", content.contentCode);
    formData.append("title", content.title);
    formData.append("type", content.type);
    formData.append("lessonId", String(content.lessonId));
    formData.append("fileData", fileData);

    const response = await axios.put(`/contents/${content.contentId}`, formData, {
        headers: {
            "Content-Type": undefined,
        },
    });

    return response.data;
};