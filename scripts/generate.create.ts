import endpoints from "@lib/endpoints.json";
import { generateCreateRaw } from "./generate.create.raw";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { getLogger } from "@utils/io/getLogger";
import { readJsonFile } from "@utils/io/readJsonFile";
import { CreateSucessSchema } from "@schemas/CreateSucessSchema";
import { CreateErrorSchema } from "@schemas/CreateErrorSchema";
import {
  STATS_COUNTS_FILE_PATH,
  STATS_LOGFILES_FILE_PATH,
} from "@constants/paths/logs";
import { writeStringToFile } from "@utils/io";
import { clearFileContents } from "@utils/io/clearFileContents";
import { clearLogs } from "@utils/io/clearLogs";

const logger = getLogger({
  logFileName: "generate.create",
});
type Endpoint = {
  createUrl: string;
  method: string;
  name: string;
  createRequestBody: object;
};

const allEndpoints = endpoints as Endpoint[];

const processEndpoint = async (ep: Endpoint) => {
  const { createUrl, method, name, createRequestBody } = ep;

  if (!createUrl) {
    await logger.error({
      title: `${name}: createUrl not found`,
      data: `${name}: skipped..`,
      errorFilePath: "./scripts/generate.create.ts",
    });
    return;
  }

  if (!createRequestBody) {
    await logger.error({
      title: `${name}: createRequestBody is empty: `,
      data: `${name}, skipped..`,
      errorFilePath: "./scripts/generate.create.ts",
    });
  }
  const fetchURL = await getFetchUrl(createUrl);
  const { headers: detailsHeaders } = await getFetchHeaders();
  const headers = new Headers();
  headers.append("Authorization", detailsHeaders.Authorization);
  headers.append("x-api-key", detailsHeaders["x-api-key"]);
  headers.append("Cookie", detailsHeaders.Cookie);

  const formData = new FormData();
  Object.entries(createRequestBody ?? {}).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const rawFilePath = await generateCreateRaw({
    endpointName: name,
    fetchUrl: fetchURL,
    method,
    headers,
    formData,
  });

  console.log(rawFilePath);
  const rawDataArray = await readJsonFile({
    filePath: rawFilePath,
  });

  if (!rawDataArray) {
    await logger.error({
      title: `${name}: ${rawFilePath} is empty: `,
      data: `${name} skipped..`,
      errorFilePath: "./scripts/generate.create.ts",
    });
    return;
  }

  const rawObject = rawDataArray[0];
  const isError = !!rawObject?.error;

  const rawObjectSchema = isError ? CreateErrorSchema : CreateSucessSchema;
  const validatedData = rawObjectSchema.parse(rawObject);
  const validatedDataFilePath = `./json/${name}/data.create.json`;
  await writeStringToFile({
    data: JSON.stringify(validatedData, null, 2),
    filePath: validatedDataFilePath,
  });

  await logger.info({
    title: `${name}: SUCCES`,
    data: rawObject,
  });
};

await clearFileContents(STATS_COUNTS_FILE_PATH);
await clearFileContents(STATS_LOGFILES_FILE_PATH);
await clearLogs();

const main = async () => {
  await Promise.all(allEndpoints.map(processEndpoint));
};

console.log("Generated Files:");
await main();

const loggedDataCount = await readJsonFile({
  filePath: STATS_COUNTS_FILE_PATH,
});

const logFiles = await readJsonFile({
  filePath: STATS_LOGFILES_FILE_PATH,
});

console.log(loggedDataCount);

console.log("Log Files:");
logFiles.forEach(async (logFile: string) => {
  console.log(logFile);
});
