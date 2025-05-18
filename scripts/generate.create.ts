import {
  STATS_COUNTS_FILE_PATH,
  STATS_LOGFILES_FILE_PATH,
} from "@constants/paths/logs";
import endpoints from "@lib/endpoints.json";
import { CreateErrorSchema } from "@schemas/CreateErrorSchema";
import { CreateSuccessSchema } from "@schemas/CreateSuccessSchema";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import {
  writeStringToFile,
  clearFileContents,
  clearLogs,
  readJsonFile,
} from "@utils/io";
import { getLogger } from "@utils/io/getLogger";
import { getModelZodSchema } from "@utils/model";

type Endpoint = {
  name: string;
  method: string;
  createUrl: string;
  createRequestBody: Record<string, any>;
};

const logger = getLogger({ logFileName: "generate.create" });
const allEndpoints = endpoints as Endpoint[];

/** Write Zod schema for request body */
async function generateRequestBodySchema(endpointName: string, body: object) {
  const schema = await getModelZodSchema(
    `${endpointName}CreateRequestBody`,
    JSON.stringify(body, null, 2)
  );

  const filePath = `./schemas/${endpointName}/create.body.schema.ts`;
  await writeStringToFile({ filePath, data: schema });
  return filePath;
}

/** Fetch raw create response and save it */
async function fetchAndSaveRawCreate({
  endpointName,
  url,
  method,
  headers,
  body,
}: {
  endpointName: string;
  url: string;
  method: string;
  headers: Headers;
  body: FormData;
}) {
  const response = await fetch(url, { method, headers, body });

  let json = {};
  try {
    json = await response.json();
  } catch (err) {
    console.error(`Failed to parse JSON for ${endpointName}`, err);
  }

  const filePath = `./json/${endpointName}/raw.create.json`;
  await writeStringToFile({ filePath, data: JSON.stringify(json, null, 2) });

  return filePath;
}

/** Main processor for a single endpoint */
async function processEndpoint(endpoint: Endpoint) {
  const { name, createUrl, method, createRequestBody } = endpoint;

  if (!createUrl) {
    return logger.error({
      title: `${name}: createUrl not found`,
      data: "Skipped endpoint due to missing URL",
      errorFilePath: "./scripts/generate.create.ts",
    });
  }

  if (!createRequestBody) {
    return logger.error({
      title: `${name}: createRequestBody is missing`,
      data: "Skipped endpoint due to missing request body",
      errorFilePath: "./scripts/generate.create.ts",
    });
  }

  console.log(`Processing ${name}...`);

  const schemaPath = await generateRequestBodySchema(name, createRequestBody);
  console.log(`Request schema written: ${schemaPath}`);

  const fetchUrl = await getFetchUrl(createUrl);
  const { headers: baseHeaders } = await getFetchHeaders();

  const headers = new Headers({
    Authorization: baseHeaders.Authorization,
    "x-api-key": baseHeaders["x-api-key"],
    Cookie: baseHeaders.Cookie,
  });

  const formData = new FormData();
  for (const [key, value] of Object.entries(createRequestBody)) {
    formData.append(key, value);
  }

  const rawPath = await fetchAndSaveRawCreate({
    endpointName: name,
    url: fetchUrl,
    method,
    headers,
    body: formData,
  });

  const rawData = await readJsonFile({ filePath: rawPath });
  if (!rawData || !rawData.length) {
    return logger.error({
      title: `${name}: Empty response`,
      data: "Raw data was empty",
      errorFilePath: "./scripts/generate.create.ts",
    });
  }

  const rawItem = rawData[0];
  const schema = rawItem?.error ? CreateErrorSchema : CreateSuccessSchema;

  try {
    const validated = schema.parse(rawItem);
    const dataPath = `./json/${name}/data.create.json`;
    await writeStringToFile({
      filePath: dataPath,
      data: JSON.stringify(validated, null, 2),
    });

    await logger.info({
      title: `${name}: SUCCESS`,
      data: validated,
    });
  } catch (validationError) {
    await logger.error({
      title: `${name}: Validation failed`,
      data: JSON.stringify(validationError),
      errorFilePath: "./scripts/generate.create.ts",
    });
  }
}

/** Sequentially process all endpoints */
async function main() {
  await clearFileContents(STATS_COUNTS_FILE_PATH);
  await clearFileContents(STATS_LOGFILES_FILE_PATH);
  await clearLogs();

  for (const endpoint of allEndpoints) {
    await processEndpoint(endpoint);
  }

  console.log("Generated Files:");

  const counts = await readJsonFile({ filePath: STATS_COUNTS_FILE_PATH });
  console.log(counts);

  const logs = await readJsonFile({ filePath: STATS_LOGFILES_FILE_PATH });
  console.log("Log Files:");
  for (const file of logs || []) {
    console.log(file);
  }
}

await main();
