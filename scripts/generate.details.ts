// scripts/generate.ts
import { ResponseSchema } from "@schemas/responseSchema";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { writeStringToFile } from "@utils/io";
import { getModelZodSchema } from "@utils/model";

const SCHEMAS_DIR = "./schemas";
// const TYPES_DIR = "./types";
const JSON_DIR = "./json";

import endpoints from "@lib/endpoints.json";
import { getLogger } from "@utils/io/getLogger";

const logger = getLogger({ logFileName: "generate" });

const fetchHeaders = await getFetchHeaders();
endpoints.forEach(async ({ name, url, method, listRequestBody }) => {
  const fetchUrl = await getFetchUrl(url);
  console.log(`fetching ${fetchUrl}`);
  const response = await fetch(fetchUrl, {
    method: method,
    headers: fetchHeaders.headers,
    body: JSON.stringify(listRequestBody),
  });

  // ! raw response
  const responseJson = await response.json();
  const responseJsonString = JSON.stringify(responseJson, null, 2);

  const responseJsonFilePath = `./${JSON_DIR}/${name}/raw.json`;
  await writeStringToFile({
    filePath: responseJsonFilePath,
    data: responseJsonString,
  });

  // ! validate raw response
  const validatedResponseJson = ResponseSchema.parse(responseJson);
  const { id, jsonrpc, result } = validatedResponseJson;
  const {
    statusCode: responseStatusCode,
    status: responseStatus,
    data: responseData,
  } = result;

  // ! result json
  const dataJsonString = JSON.stringify(responseData, null, 2);
  const dataJsonFilePath = `./${JSON_DIR}/${name}/data.json`;
  await writeStringToFile({
    filePath: dataJsonFilePath,
    data: dataJsonString,
  });

  //  ! zod schema
  const responseDataZodSchema = await getModelZodSchema(name, dataJsonString);
  const responseDataZodSchemaFilePath = `./${SCHEMAS_DIR}/${name}/schema.ts`;
  await writeStringToFile({
    filePath: responseDataZodSchemaFilePath,
    data: responseDataZodSchema,
  });

  logger.info({
    data: {
      name,
      status: responseStatus,
      statusCode: responseStatusCode,
      numItems: responseData.length + " items ",
      message: "success",
    },
  });
});
