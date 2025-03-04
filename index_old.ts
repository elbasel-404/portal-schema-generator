// import { getModelDefinitionString, getModelZodSchema } from "./utils/json";
// import { writeStringToFile } from "./utils/io";
// import vacationObject from "./vacation.json";

// const modelName = "vacation";

// const ROOT_MODELS_PATH = "./generated/models";

// const jsonString = JSON.stringify(vacationObject);
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
