import { appendFile } from "node:fs/promises";

/**
 * Append a string to a file, creating the file if it does not exist.
 * @param path - The path to the file.
 * @param data - The data to append to the file.
 */
interface AppendStringToFileArgs {
  path: string;
  data: string | Buffer;
}
export const appendStringToFile = async ({
  path,
  data,
}: AppendStringToFileArgs) => {
  await appendFile(path, data);
};
