// scripts/generate.ts

import endpoints from "@lib/endpoints.json";
import { ResponseSchema } from "@schemas/responseSchema";
import { getFetchHeaders, getFetchUrl } from "@utils/http";
import { writeStringToFile } from "@utils/io";
import { getModelZodSchema } from "@utils/model";
import { mkdirSync } from "fs";
import { dirname } from "path";

const SCHEMAS_DIR = "./schemas";
const JSON_DIR = "./json";

type Endpoint = {
  name: string;
  url: string;
  method: string;
  listRequestBody?: Record<string, any>;
};

const ensureDir = (path: string) => {
  try {
    mkdirSync(dirname(path), { recursive: true });
  } catch (err) {
    console.error("Failed to create directory:", err);
  }
};

const main = async () => {
  let successfulCount = 0;
  let errorCount = 0;
  const fetchHeaders = await getFetchHeaders();

  for (const {
    name,
    url,
    method,
    listRequestBody,
  } of endpoints as Endpoint[]) {
    try {
      const fetchUrl = await getFetchUrl(url);
      console.log("\x1b[33m%s\x1b[0m", `fetching ${name}\n`);
      // console.log(`url ${fetchUrl}`);

      const response = await fetch(fetchUrl, {
        verbose: true,
        method,
        headers: fetchHeaders.headers,
        body: listRequestBody ? JSON.stringify(listRequestBody) : undefined,
      });

      if (response.ok) {
        successfulCount++;
      } else {
        errorCount++;
      }
      console.log(
        "\x1b[34m%s\x1b[0m",
        "------------------------------------------------------------\n"
      );

      // ! Parse JSON
      const responseJson = await response.json();
      const responseJsonString = JSON.stringify(responseJson, null, 2);
      const responseJsonFilePath = `${JSON_DIR}/${name}/raw.json`;
      ensureDir(responseJsonFilePath);
      await writeStringToFile({
        filePath: responseJsonFilePath,
        data: responseJsonString,
      });

      // ! validate response
      const validatedResponseJson = ResponseSchema.parse(responseJson);
      const { result } = validatedResponseJson;
      const {
        statusCode: responseStatusCode,
        status: responseStatus,
        data: responseData,
      } = result;

      // ! Write data.json
      const dataJsonString = JSON.stringify(responseData, null, 2);
      const dataJsonFilePath = `${JSON_DIR}/${name}/data.json`;
      ensureDir(dataJsonFilePath);
      await writeStringToFile({
        filePath: dataJsonFilePath,
        data: dataJsonString,
      });

      // ! Generate and write Zod schema
      const zodSchema = await getModelZodSchema(name, dataJsonString);
      const zodSchemaFilePath = `${SCHEMAS_DIR}/${name}/schema.ts`;
      ensureDir(zodSchemaFilePath);
      await writeStringToFile({
        filePath: zodSchemaFilePath,
        data: zodSchema,
      });
    } catch (error) {
      console.error(`\x1b[31mError processing ${name}:\x1b[0m`, error);
    }
  }
  console.log("\x1b[32m%s\x1b[0m", "Fetched all endpoints");
  console.log({ successfulCount, errorCount });
};

main().catch((err) => {
  console.error("Fatal error in script:", err);
});
