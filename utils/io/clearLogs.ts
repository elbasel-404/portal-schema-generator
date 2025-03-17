import { LOG_DIR } from "@constants/paths/logs";
import { getDirFiles } from "./getDirFiles";
import { clearFileContents } from "./clearFileContents";
import { lstat } from "fs/promises";

export const clearLogs = async () => {
  const logFiles = await getDirFiles(LOG_DIR);
  await Promise.all(
    logFiles.map(async (file) => {
      const filePath = `${LOG_DIR}/${file}`;
      const stats = await lstat(filePath);
      if (!stats.isDirectory()) {
        await clearFileContents(filePath);
      }
    })
  );
};
