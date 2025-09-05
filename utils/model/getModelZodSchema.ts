import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  TargetLanguage,
} from "quicktype-core";

/**
 * Converts JSON string to TypeScript Zod schema using quicktype-core
 * 
 * @param targetLanguage - The target language for code generation (typically "typescript-zod")
 * @param typeName - Name for the generated type/schema
 * @param jsonString - JSON string to analyze and convert
 * @returns Promise resolving to quicktype result with generated code
 */
const quicktypeJSON = async (
  targetLanguage: string | TargetLanguage,
  typeName: string,
  jsonString: string
) => {
  // Create a JSON input for TypeScript Zod target
  const jsonInput = jsonInputForTargetLanguage("typescript-zod");

  // Add the sample JSON data as a source for type inference
  // Multiple samples can be added to improve type accuracy
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  // Prepare input data for quicktype processing
  const inputData = new InputData();
  inputData.addInput(jsonInput);

  // Generate TypeScript Zod schema from the input data
  return await quicktype({
    inputData,
    lang: "typescript-zod",
  });
};

/**
 * Generates a Zod validation schema from JSON response data
 * 
 * This function analyzes JSON structure and creates a corresponding Zod schema
 * that can be used for runtime validation and TypeScript type inference.
 * 
 * @param modelName - Name for the generated schema (e.g., "UserProfile")
 * @param jsonString - JSON string representing the data structure
 * @returns Promise resolving to a string containing the Zod schema code
 * 
 * @example
 * ```typescript
 * const jsonData = '{"id": 1, "name": "John", "active": true}';
 * const schema = await getModelZodSchema("User", jsonData);
 * // Returns: "export const UserSchema = z.object({ id: z.number(), name: z.string(), active: z.boolean() });"
 * ```
 */
export async function getModelZodSchema(modelName: string, jsonString: string): Promise<string> {
  const { lines: model } = await quicktypeJSON(
    "typescript-zod",
    modelName,
    jsonString
  );
  return model.join("\n");
}
