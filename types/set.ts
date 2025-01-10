import { z, ZodType } from "zod";

export type SetData = {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
  is_draft: boolean;
  tags: string[];
  users_enrolled: { id: string; profile_picture: string }[];
};

export const formSetSchema: ZodType<SetData> = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  is_public: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  is_draft: z.boolean(),
  tags: z.array(z.string()),
  users_enrolled: z.array(
    z.object({
      id: z.string(),
      profile_picture: z.string(),
    })
  ),
});
