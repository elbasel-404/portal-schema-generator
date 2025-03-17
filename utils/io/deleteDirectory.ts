// utils/io/deleteDirectory.ts
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
    console.error(`Failed to delete directory at ${path}:`, error);
  }
};
