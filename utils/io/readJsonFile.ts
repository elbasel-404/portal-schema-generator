import { file } from "bun";
import { doesFileExist } from "./doesFileExist";

// file.type; // => "application/json;charset=utf-8";

interface ReadJsonFileArgs {
  filePath: string;
}
export const readJsonFile = async ({ filePath }: ReadJsonFileArgs) => {
  const fileExists = await doesFileExist({ filePath });
  if (!fileExists) {
    console.log({ filePath });
    throw new Error(
      `Error reading json file, file does not exist: ${filePath}`
    );
  }
  const jsonFile = file(filePath);

  try {
    const jsonData = await jsonFile.json();
    return jsonData;
  } catch (error) {
    return null;
  }
};
