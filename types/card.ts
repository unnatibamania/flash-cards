import { z, ZodType } from "zod"; // Add new import

export type CardData = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  order: number;
  is_visited: boolean;
};

export const formCardSchema: ZodType<CardData> = z.object({
  id: z.string(),
  question: z.string().min(1, { message: "Question is required" }),
  answer: z.string().min(1, { message: "Answer is required" }),
  tags: z.array(z.string()),
  order: z.number(),
  is_visited: z.boolean(),
});
