// utils/http/getFetchUrl.ts
import { getLogger } from "@utils/io/getLogger";
import { env } from "bun";

const logger = getLogger({
  logFileName: "main",
});

export const getFetchUrl = async (url: string) => {
  const API_ROOT_URL = env.API_ROOT_URL as string;
  if (!API_ROOT_URL) {
    // await logger.error({
    //   data: { API_ROOT_URL },
    //   errorFilePath: "getFetchUrl",
    // });
    throw new Error("API_ROOT_URL is not defined");
  }
  return `${API_ROOT_URL}/${url}`;
};
