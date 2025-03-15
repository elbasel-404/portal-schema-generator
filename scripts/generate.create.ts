import endpoints from "@lib/endpoints.json";
import { generateCreateRaw } from "./generate.create.raw";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { getLogger } from "@utils/io/getLogger";
import { readJsonFile } from "@utils/io/readJsonFile";
import { CreateSucessSchema } from "@schemas/CreateSucessSchema";
import { CreateErrorSchema } from "@schemas/CreateErrorSchema";

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
      title: `ERROR: No createUrl found for endpoint: ${name}`,
      data: `No createUrl found for endpoint: ${name}, skipping...`,
      errorFilePath: "./scripts/generate.create.ts",
    });
    return;
  }

  if (!createRequestBody) {
    await logger.error({
      title: `ERROR: No createRequestBody found for endpoint: ${name}`,
      data: `No createRequestBody found for endpoint: ${name}, skipping...`,
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

  // console.log(rawFilePath);
  const rawDataArray = await readJsonFile({
    filePath: rawFilePath,
  });

  if (!rawDataArray) {
    await logger.error({
      title: `ERROR: No rawDataArray found for endpoint: ${name}`,
      data: `No rawDataArray found for endpoint: ${name}, skipping...`,
      errorFilePath: "./scripts/generate.create.ts",
    });
    return;
  }

  const rawObject = rawDataArray[0];

  const isError = rawObject?.error;

  const rawObjectSchema = isError ? CreateSucessSchema : CreateErrorSchema;

  if (isError) {
    // await logger.error({
    //   title: `ERROR: Error found for endpoint: ${name}`,
    //   data: rawObject,
    //   errorFilePath: "./scripts/generate.create.ts",
    // });
    return;
  }

  await logger.info({
    title: `SUCCESS: Data logged for endpoint: ${name}`,
    data: rawObject,
  });
};

const main = async () => {
  await Promise.all(allEndpoints.map(processEndpoint));
};

const loggedDataCount = await readJsonFile({
  filePath: ".logs/loggedDataCount.json",
});

const logFiles = await readJsonFile({
  filePath: ".logs/logFiles.json",
});

console.log(loggedDataCount);

console.log("Log Files:");
logFiles.forEach(async (logFile: string) => {
  console.log(logFile);
});

console.log("Generated Files:");
await main();
