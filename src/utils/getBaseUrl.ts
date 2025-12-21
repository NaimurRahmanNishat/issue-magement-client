// src/utils/getBaseUrl.ts
export const getBaseUrl = () => {
    return import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
}