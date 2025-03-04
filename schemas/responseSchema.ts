import { z } from "zod";
import { ResultSchema } from "./resultSchema";

export const ResponseSchema = z.object({
  jsonrpc: z.string(),
  id: z.string().nullable(),
  result: ResultSchema,
});
