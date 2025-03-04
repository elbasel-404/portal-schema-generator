import type { TargetLanguage } from "quicktype-core";
import { quicktypeJSON } from "./quicktypeJSON";

interface GetModelInterfaceArgs {
  language?: string | TargetLanguage;
  modelName: string;
  jsonString: string;
}
/**
 * Generates a TypeScript interface from a provided JSON string using quicktype.
 *
 * @param language - The target language for code generation (default: "typescript").
 * @param modelName - The name to give the generated interface.
 * @param jsonString - The JSON data to convert into an interface.
 * @returns A Promise that resolves to the generated interface as a string.
 */
export const getModelInterface = async ({
  language = "typescript",
  modelName,
  jsonString,
}: GetModelInterfaceArgs) => {
  const { lines: model } = await quicktypeJSON(language, modelName, jsonString);
  return model.join("\n");
};
