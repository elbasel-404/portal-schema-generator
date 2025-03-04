import { ResponseSchema } from "@schemas/responseSchema";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { writeStringToFile } from "@utils/io";
import { getModelInterface, getModelZodSchema } from "@utils/model";

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

  // console.log({
  //   name,
  //   responseJson,
  // });

  const responseJsonFilePath = `./models/${name}/json/raw.json`;
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
  const dataJsonFilePath = `./models/${name}/json/data.json`;
  await writeStringToFile({
    filePath: dataJsonFilePath,
    data: dataJsonString,
  });

  const responseDataZodSchema = await getModelZodSchema(name, dataJsonString);
  const responseDataZodSchemaFilePath = `./models/${name}/schema.ts`;
  await writeStringToFile({
    filePath: responseDataZodSchemaFilePath,
    data: responseDataZodSchema,
  });

  const responseDataInterface = await getModelInterface({
    modelName: name,
    jsonString: dataJsonString,
  });
  const responseDataInterfaceFilePath = `./models/${name}/interface.ts`;
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
