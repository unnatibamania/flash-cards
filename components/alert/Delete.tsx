import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

export const Delete = ({
  open,
  setOpen,
  isLoading,
  deleteDraft,
  setIsLoading,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  deleteDraft: () => void;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const router = useRouter();
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          This action will delete the draft set.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              setIsLoading(true);
              await deleteDraft();
              router.refresh();
              setOpen(false);
              setIsLoading(false);
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
