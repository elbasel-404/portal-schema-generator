// utils/io/deleteFile.ts
// const exists = await file.exists();

import { file } from "bun";

interface DeleteFileArgs {
  path: string;
}
/**
 *
 * Deletes a file
 * @param path the path of the file to delete
 * @returns a promise that resolves when the file is deleted
 */
export const deleteFile = async ({ path }: DeleteFileArgs) => {
  const fileToDelete = file(path);
  await fileToDelete.delete();
};
