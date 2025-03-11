import { z } from "zod";

export const CreateResponseSchema = z
    .array(
        z.object({
            status: z.string(),
            message: z.string(),
            data: z.object({
                id: z.number(),
            }),
        })
    )
    .max(1);
