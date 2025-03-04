import { fetch, write } from "bun";
import { writeStringToFile } from "../io";

interface WriteResponseToFileArgs {
  url: string | URL;
  filePath: string;
  method: "POST" | "GET";
  headers: Record<string, string>;
  requestBody: Record<string, any>;
}

/**
 *
 * @param url the url to fetch
 * @param path the path to write the response to
 */
export const writeResponseToFile = async ({
  url,
  filePath,
  method,
  headers,
  requestBody,
}: WriteResponseToFileArgs) => {
  const requestBodyString = JSON.stringify(requestBody);

  const result = await fetch(url, {
    body: requestBodyString,
    headers,
    method,
  });
  console.log({ result });
  const resultJson = await result.json();
  const resultJsonString = JSON.stringify(resultJson);
  const bytes = await writeStringToFile({
    data: resultJsonString,
    filePath,
  });
  return bytes;
};
