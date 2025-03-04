import { writeStringToFile } from "../../utils/io";
import { readJsonFile } from "../../utils/io/readJsonFile";
import { getModelZodSchema } from "../../utils/model";

interface GenerateZodSchemaArgs {
  filePath: string;
}

// const schemaPath = `${ROOT_MODELS_PATH}/${modelName}/schema.ts`;
// const modelZodSchema = await getModelZodSchema("vacation", jsonString);

export const generateZodSchemas = async ({
  filePath,
}: GenerateZodSchemaArgs) => {
  const schemaName = filePath.split("/")[3] + "Schema";
  const jsonObject = await readJsonFile({ filePath });
  const jsonString = JSON.stringify(jsonObject);
  const modelZodSchemaString = await getModelZodSchema(schemaName, jsonString);
  const schemaPath =
    filePath.split("/")[1] + "/" + filePath.split("/")[3] + "/" + "schema.ts";

  await writeStringToFile({
    filePath: schemaPath,
    data: modelZodSchemaString,
  });
  return schemaPath;
};
