import { env } from "bun";

export const getFetchUrl = (url: string) => {
  const API_ROOT_URL = env.API_ROOT_URL as string;
  if (!API_ROOT_URL) {
    console.log({ API_ROOT_URL });
    throw new Error("API_ROOT_URL is not defined");
  }
  return `${API_ROOT_URL}/${url}`;
};
