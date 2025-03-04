import { fetch, write } from "bun";

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
  await write(filePath, result);

};
