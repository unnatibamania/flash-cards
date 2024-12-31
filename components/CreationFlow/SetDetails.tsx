import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, DraftingCompass } from "lucide-react";

export const SetDetails = ({isPublic, setIsPublic}: {isPublic: boolean, setIsPublic: (isPublic: boolean) => void} ) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex bg-white shadow-sm p-4  rounded-xl justify-between">
        <div className="flex flex-col h-fit">
          <h1 className="text-lg font-medium">
            Do you want to make it public ?
          </h1>
          <p className="text-sm text-gray-500">
            Share your cards with the world
          </p>
        </div>

        <Switch checked={isPublic} onCheckedChange={setIsPublic} />

        {/* <Button variant="outline">Create Link</Button> */}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col h-fit gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-medium">Are you ready?</h1>
          <p className="text-sm text-gray-500">
            You can always edit your cards later
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <DraftingCompass className="h-4 w-4" />
            Save as draft
          </Button>
          <Button>
            <Save className="h-4 w-4" /> Create set{" "}
          </Button>
        </div>
      </div>
    </div>
  );
};
