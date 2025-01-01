import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SetData } from "@/types/set";

export const SetToJoin = ({set}: {set: SetData}) => {
  return <div
  className="flex cursor-pointer border rounded-2xl p-4 flex-col gap-4"
>
  <div className="flex flex-col">
    <h2 className="text-lg font-bold">{set.title}</h2>
    <p className="text-xs text-gray-500">{set.description}</p>
  </div>


  <div className="flex items-center justify-between">
    <div className="flex items-center -space-x-3 relative">
      <Avatar>
        <AvatarImage src="https://github.com/itsnitinr.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Avatar className=" ">
        <AvatarImage src="https://github.com/ameybh.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Avatar className="">
        <AvatarImage src="https://github.com/unnatibamania.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Avatar className="">
        {/* <AvatarImage src="https://github.com/.png" /> */}
        <AvatarFallback>+4</AvatarFallback>
      </Avatar>
    </div>

    <Button
      variant="outline"
      onClick={() => {
        // router.push(`/cards/${set.id}`);
      }}
    >
      Join
    </Button>
  </div>
</div>;
};
