import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  TargetLanguage,
} from "quicktype-core";

const quicktypeJSON = async (
  targetLanguage: string | TargetLanguage,
  typeName: string,
  jsonString: string
) => {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types.quicktypeJSON Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
  });
};

export async function getModelZodSchema(modleName: string, jsonString: string) {
  const { lines: model } = await quicktypeJSON(
    "typescript-zod",
    modleName,
    jsonString
  );
  return model.join("\n");
}
