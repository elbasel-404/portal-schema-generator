import { ResponseSchema } from "@schemas/responseSchema";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { writeStringToFile } from "@utils/io";
import { getModelInterface, getModelZodSchema } from "@utils/model";

const SCHEMAS_DIR = "./schemas";
const TYPES_DIR = "./types";
const JSON_DIR = "./json";

import endpoints from "@lib/endpoints.json";

const fetchHeaders = getFetchHeaders();
endpoints.forEach(async ({ name, url, method, listRequestBody }) => {
  const fetchUrl = getFetchUrl(url);
  const response = await fetch(fetchUrl, {
    method: method,
    headers: fetchHeaders.headers,
    body: JSON.stringify(listRequestBody),
  });

  const responseJson = await response.json();
  const responseJsonString = JSON.stringify(responseJson, null, 2);

  const responseJsonFilePath = `./${JSON_DIR}/${name}/raw.json`;
  await writeStringToFile({
    filePath: responseJsonFilePath,
    data: responseJsonString,
  });

  const validatedResponseJson = ResponseSchema.parse(responseJson);
  const { id, jsonrpc, result } = validatedResponseJson;
  const { statusCode, status, data } = result;

  // console.log({
  //   name,
  //   id,
  //   jsonrpc,
  //   statusCode,
  //   status,
  //   data: data.length + " items",
  // });

  const dataJsonString = JSON.stringify(data, null, 2);
  const dataJsonFilePath = `./${JSON_DIR}/${name}/data.json`;
  await writeStringToFile({
    filePath: dataJsonFilePath,
    data: dataJsonString,
  });

  const responseDataZodSchema = await getModelZodSchema(name, dataJsonString);
  const responseDataZodSchemaFilePath = `./${SCHEMAS_DIR}/${name}/schema.ts`;
  await writeStringToFile({
    filePath: responseDataZodSchemaFilePath,
    data: responseDataZodSchema,
  });

  const responseDataInterface = await getModelInterface({
    modelName: name,
    jsonString: dataJsonString,
  });
  const responseDataInterfaceFilePath = `./${TYPES_DIR}/${name}/interface.ts`;
  await writeStringToFile({
    filePath: responseDataInterfaceFilePath,
    data: responseDataInterface,
  });

  console.log({
    name,
    status,
    statusCode,
    data: data.length + " items",
    responseJsonFilePath,
    dataJsonFilePath,
    responseDataZodSchemaFilePath,
    responseDataInterfaceFilePath,
  });
});
