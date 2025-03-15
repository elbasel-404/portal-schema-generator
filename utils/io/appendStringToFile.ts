import { appendFile } from "node:fs/promises";
import { getLogger } from "./getLogger";

const logger = getLogger({ logFileName: "main" });

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
  try {
    await appendFile(path, data);
    return 1;
  } catch (error) {
    // await logger.error({
    //   data: `Error appending data to file: ${path}`,
    //   errorFilePath: "utils/io/appendStringToFile.ts",
    // });
    // await logger.error({
    //   data: error as Error,
    //   errorFilePath: "utils/io/appendStringToFile.ts",
    // });
  }

  return 0;
};
