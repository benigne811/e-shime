export const API_BASE =
  typeof window !== "undefined"
    ? (import.meta.env.NEXT_PUBLIC_API_BASE as string) || "https://e-shime.onrender.com"
    : process.env.NEXT_PUBLIC_API_BASE || "https://e-shime.onrender.com";

export const SOCKET_BASE =
  typeof window !== "undefined"
    ? (import.meta.env.NEXT_PUBLIC_SOCKET_BASE as string) || API_BASE
    : process.env.NEXT_PUBLIC_SOCKET_BASE || API_BASE;