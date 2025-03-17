import { readdir } from "node:fs/promises";

export const getDirFiles = async (dir: string) => {
  const files = await readdir(dir, { recursive: true });
  return files;
};
