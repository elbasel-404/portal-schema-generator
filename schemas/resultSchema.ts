import { z } from "zod";

export const ResultSchema = z.object({
  statusCode: z.number(),
  status: z.string(),
  data: z.array(z.any()),
});
