import { ResponseSchema } from "@schemas/responseSchema";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { writeStringToFile } from "@utils/io";
import { getModelZodSchema } from "@utils/model";

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

  console.log({
    name,
    responseJson,
  });

  await writeStringToFile({
    filePath: `./models/${name}/json/raw.json`,
    data: responseJsonString,
  });

  const validatedResponseJson = ResponseSchema.parse(responseJson);
  const { id, jsonrpc, result } = validatedResponseJson;
  const { statusCode, status, data } = result;
  console.log({
    name,
    id,
    jsonrpc,
    statusCode,
    status,
    data: data.length + " items",
  });

  const dataJsonString = JSON.stringify(data, null, 2);
  await writeStringToFile({
    filePath: `./models/${name}/json/data.json`,
    data: dataJsonString,
  });

  const responseDataZodSchema = await getModelZodSchema(name, dataJsonString);
  await writeStringToFile({
    filePath: `./models/${name}/schema.ts`,
    data: responseDataZodSchema,
  });
});
