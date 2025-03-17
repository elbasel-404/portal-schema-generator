// utils/io/writeStringToFile.ts
import { write } from "bun";

/**
 *
 * @param path the path to the file
 * @param data  the data to write to the file
 * @returns bytes the number of bytes written to disk.
 */
interface WriteStringToFileArgs {
  filePath: string;
  data: string | Buffer;
}
export const writeStringToFile = async ({
  filePath,
  data,
}: WriteStringToFileArgs) => {
  const bytes = await write(filePath, data);
  return bytes;
};
