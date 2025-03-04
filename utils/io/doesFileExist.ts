import { file } from "bun";

interface DoesFileExistArgs {
  filePath: string;
}
/**
 *
 * @param path the path to the file to check
 * @returns fileExists a boolean indicating if the file exists
 */
export const doesFileExist = async ({ filePath }: DoesFileExistArgs) => {
  const fileToCheck = file(filePath);
  const fileExists = await fileToCheck.exists();
  return fileExists;
};
