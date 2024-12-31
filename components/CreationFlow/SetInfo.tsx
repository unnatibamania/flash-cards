import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const SetInfo = ({setTitle, setDescription, setTags, title, description, tags}: {setTitle: (title: string) => void, setDescription: (description: string) => void, setTags: (tags: string[]) => void, title: string, description: string, tags: string[]}) => {
  return (
    <section className="flex  flex-col gap-4">
      <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} />

      <Textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} />

      <Input placeholder="Tags" onChange={(e) => setTags(e.target.value.split(','))} value={tags.join(',')} />
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
