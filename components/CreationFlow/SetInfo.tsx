import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Pill } from "@/components/ui/pill";
// import { Button } from "@/components/ui/button";

export const SetInfo = () => {
  return (
    <section className="flex  flex-col gap-4">
      <Input placeholder="Title" />

      <Textarea placeholder="Description" />

      <Input placeholder="Tags" />
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
