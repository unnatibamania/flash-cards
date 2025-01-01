import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { SetFormValues } from "@/app/(dashboard)/create/page";

export const SetInfo = ({ form }: { form: UseFormReturn<SetFormValues> }) => {
  return (
    <section className="flex  flex-col gap-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea placeholder="Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Tags" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-wrap gap-2">
        {/* {tags.map((tag) => (
      <Pill
        key={tag}
        tag={tag}
        onClick={() => {
          setTags(tags.filter((t) => t !== tag));
        }}
      />
    ))} */}
      </div>

      {/* <Button onClick={handleCreateSet}>Create Set</Button> */}
    </section>
  );
};
