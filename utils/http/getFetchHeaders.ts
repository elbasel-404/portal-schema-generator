// utils/http/getFetchHeaders.ts
import { getLogger } from "@utils/io/getLogger";
import { env } from "bun";

const logger = getLogger({
  logFileName: "main",
});
export const getFetchHeaders = async () => {
  const API_KEY = env.API_KEY as string;
  const API_KEY_HEADER_NAME = env.API_KEY_HEADER_NAME as string;
  const BEARER_TOKEN = env.BEARER_TOKEN as string;
  const SESSION_ID = env.SESSION_ID as string;

  if (!API_KEY || !API_KEY_HEADER_NAME || !BEARER_TOKEN || !SESSION_ID) {
    // await logger.info({
    //   data: {
    //     API_KEY,
    //     API_KEY_HEADER_NAME,
    //     BEARER_TOKEN,
    //     SESSION_ID,
    //   },
    // });
    throw new Error("Missing env variables");
  }

  const headers = {
    [API_KEY_HEADER_NAME]: API_KEY,
    Authorization: `Bearer ${BEARER_TOKEN}`,
    "Content-Type": "application/json",
    Cookie: `session_id=${SESSION_ID}`,
  };
  return { headers };
};
