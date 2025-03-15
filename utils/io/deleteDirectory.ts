import { rm } from "node:fs/promises";
import { getLogger } from "./getLogger";

const logger = getLogger({
  logFileName: "main",
});

interface DeleteDirectoryArgs {
  path: string;
}

/**
 * Deletes a directory and all its content.
 * @param path - The path to the directory to delete.
 * @returns A promise that resolves when the directory is deleted.
 *
 */
export const deleteDirectory = async ({ path }: DeleteDirectoryArgs) => {
  try {
    await rm(path, { recursive: true });
  } catch (error) {
    // logger.error({
    //   data: `Error deleting directory: ${path}`,
    //   errorFilePath: "utils/io/deleteDirectory.ts",
    // });
    // logger.error({
    //   data: error as Error,
    //   errorFilePath: "utils/io/deleteDirectory.ts",
    // });
  }
};
