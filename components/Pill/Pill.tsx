import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const Pill = ({
  tag,
  onClick,
  hasAction = true,
}: {
  tag: string;
  onClick: () => void;
  hasAction?: boolean;
}) => {
  return (
    <Badge
      key={tag}
      variant="secondary"
      className="text-xs rounded-full text-blue-600 bg-blue-300/40 hover:bg-blue-300/60"
    >
      {tag}
      {hasAction ? (
        <Button
          type="button"
          variant={"ghost"}
          // variant="ghost"
          size="icon"
          className="h-4 w-4 ml-1 hover:bg-transparent hover:text-blue-600"
          onClick={onClick}
        >
          <X className="h-2 w-2" />
        </Button>
      ) : null}
    </Badge>
  );
};