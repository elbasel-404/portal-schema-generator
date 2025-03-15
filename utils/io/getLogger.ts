import type { LogFileName } from "@type/LogFileName";
import { LOG_DIR } from "../../constants/LOG_DIR";
import { appendStringToFile } from "./appendStringToFile";
import { writeStringToFile } from "./writeStringToFile";

const PRIVATE_DATA_DIR = "./.logs";

const loggedDataCount = {
  info: 0,
  error: 0,
};

const logFiles = new Set();

type Data = string | object | Error;

type LogInfoArgs = {
  logFileName: LogFileName;
  data: Data;
  isError?: boolean;
  errorFilePath?: string;
  title?: string;
};

const log = async ({
  logFileName,
  data,
  isError = false,
  errorFilePath,
  title,
}: LogInfoArgs): Promise<1> => {
  // let dataString = data as string;

  // if (typeof data === "object") {
  //   dataString = "\n" + JSON.stringify(data, null, 2) + "\n";
  // }

  let logFilePath = `${LOG_DIR}/${logFileName}`;
  const logFileSuffix = isError ? "error" : "log";

  const filePath = `${logFilePath}.${logFileSuffix}`;

  if (errorFilePath) {
    // let errorString = "\n";
    // errorString += "\n";
    // errorString += "===================================";
    // errorString += "\n";
    // errorString += dataString;
    // errorString += "\n";
    // errorString += "===================================";
    // errorString += "\n";
    // errorString += await appendStringToFile({
    //   path: filePath,
    //   data: errorString,
    // });
    // return 1;
    // await appendStringToFile({
    //   data: "\n" + errorFilePath + "\n",
    //   path: filePath,
    // });
  }

  loggedDataCount[isError ? "error" : "info"] += 1;
  logFiles.add(filePath);

  // console.log({
  //   loggedDataCount,
  //   logFiles,
  // });

  await writeStringToFile({
    data: JSON.stringify(loggedDataCount),
    filePath: `${PRIVATE_DATA_DIR}/loggedDataCount.json`,
  });

  await writeStringToFile({
    data: JSON.stringify(Array.from(logFiles)),
    filePath: `${PRIVATE_DATA_DIR}/logFiles.json`,
  });

  await appendStringToFile({
    data: title ? `\n${title}\n` : "",
    path: filePath,
  });

  //
  return 1;
};

type GetLoggerArgs = {
  logFileName: LogFileName;
};

export const getLogger = ({ logFileName }: GetLoggerArgs) => {
  type LogDataArgs = {
    data: Data;
    isError?: boolean;
    title?: string;
  };

  interface LogErrorArgs {
    data: Data;
    errorFilePath: string;
    title?: string;
  }

  type Logger = {
    info: (args: LogDataArgs) => Promise<1>;
    error: (data: LogErrorArgs) => Promise<1>;
  };

  const logToFile = async ({
    data,
    isError,
    title,
  }: LogDataArgs): Promise<1> => {
    return await log({
      logFileName,
      data,
      isError,
      title,
    });
  };

  const logger: Logger = {
    info: async (args: LogDataArgs) => await logToFile(args),
    error: async ({ data, errorFilePath, title }: LogErrorArgs) =>
      await log({
        logFileName,
        data,
        isError: true,
        errorFilePath,
        title,
      }),
  };

  return logger;
};
