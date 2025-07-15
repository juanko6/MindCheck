// services/config.js

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Asegura que siempre termine con "/"
export const API_BASE = BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/";
