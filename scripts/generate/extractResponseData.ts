import { ResponseSchema } from "../../schemas/responseSchema";
import { writeStringToFile } from "../../utils/io";
import { readJsonFile } from "../../utils/io/readJsonFile";

interface ExtractrResponseDataArgs {
  filePath: string;
}
export const extractResponseData = async ({
  filePath,
}: ExtractrResponseDataArgs) => {
  const endpointName = filePath.split("/")[3];
  const jsonObject = await readJsonFile({ filePath });
  const validatedJsonObject = ResponseSchema.parse(jsonObject);
  const { id, jsonrpc, result } = validatedJsonObject;
  const { statusCode, status, data } = result;
  console.log({
    endpointName,
    id,
    jsonrpc,
    statusCode,
    status,
    data: data.length + " items",
  });

  const dataString = JSON.stringify(data, null, 2);
  const dataFilePath = filePath.replace(".json", ".data.json");
  await writeStringToFile({
    filePath: dataFilePath,
    data: dataString,
  });
  return dataFilePath;
};
