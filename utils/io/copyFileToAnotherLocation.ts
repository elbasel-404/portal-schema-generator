import { write, file, type BunFile } from "bun";

interface CopyFileToAnotherLocation {
  source: string | BunFile;
  destination: string;
}
/**
 *
 * @param source The source file to copy
 * @param destination The destination file to copy to
 * @returns Promise<number> The number of bytes copied
 */
export const copyFileToAnotherLocation = async ({
  source,
  destination,
}: CopyFileToAnotherLocation) => {
  const fileToCopy = typeof source === "string" ? file(source) : source;
  const bytes = await write(destination, fileToCopy);
  return bytes;
};
