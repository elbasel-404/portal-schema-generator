// import { getModelDefinitionString, getModelZodSchema } from "./utils/json";
// import { writeStringToFile } from "./utils/io";
// import vacationObject from "./vacation.json";

import { generateRawJsonResponses } from "../scripts/generate";
import { extractResponseData } from "../scripts/generate/extractResponseData";
import { generateZodSchemas } from "../scripts/generate/generateZodSchemas";

// const modelName = "vacation";

const ROOT_MODELS_PATH = "./models";

const rawFilePaths = await generateRawJsonResponses({
  rootGenerationPath: ROOT_MODELS_PATH,
});

rawFilePaths.forEach(async (rawResponsePath) => {
  const dataPath = await extractResponseData({
    filePath: rawResponsePath,
  });
  const zodSchemaPath = await generateZodSchemas({
    filePath: dataPath,
  });

  console.log({ rawResponsePath, dataPath, zodSchemaPath });
});

// console.log({ dataPaths });
// const interfacePath = `${ROOT_MODELS_PATH}/${modelName}/interface.ts`;
// const schemaPath = `${ROOT_MODELS_PATH}/${modelName}/schema.ts`;

// console.log({ interfacePath, schemaPath });

// const modelTypescriptDefinition = await getModelDefinitionString(
//   "vacation",
//   jsonString
// );

// const modelZodSchema = await getModelZodSchema("vacation", jsonString);

// await writeStringToFile({
//   data: modelTypescriptDefinition,
//   path: interfacePath,
// });

// await writeStringToFile({
//   path: schemaPath,
//   data: modelZodSchema,
// });
