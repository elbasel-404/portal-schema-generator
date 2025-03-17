// utils/io/clearFileContents.ts
import { truncate } from "fs/promises";

/**
 *
 * @param filePath - The path to the file.
 * Clear the contents of a file.
 * @returns - A promise that resolves with 1 if the file was cleared, or 0 if an error occurred.
 */
export const clearFileContents = async (filePath: string) => {
  await truncate(filePath, 0);
};
