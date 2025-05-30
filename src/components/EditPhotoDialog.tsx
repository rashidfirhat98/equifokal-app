import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Photo } from "@/models/Images";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPhoto: Photo | null;
  editAlt: string;
  setEditAlt: (val: string) => void;
  addToPortfolio: boolean;
  setAddToPortfolio: (val: boolean) => void;
  makeProfilePicture: boolean;
  setMakeProfilePicture: (val: boolean) => void;
  onSave: () => void;
};

export function EditPhotoDialog({
  open,
  onOpenChange,
  editPhoto,
  editAlt,
  setEditAlt,
  addToPortfolio,
  setAddToPortfolio,
  makeProfilePicture,
  setMakeProfilePicture,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
          <DialogDescription>
            Modify photo details like title.
          </DialogDescription>
        </DialogHeader>

        {editPhoto && (
          <div className="flex justify-center mb-4">
            <Image
              src={editPhoto.src.large}
              alt={editPhoto.alt}
              width={300}
              height={300}
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="alt">Photo Title</Label>
            <Input
              id="alt"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="portfolio"
              checked={addToPortfolio}
              onCheckedChange={(v) => setAddToPortfolio(!!v)}
            />
            <Label htmlFor="portfolio">Add to Portfolio</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="profile"
              checked={makeProfilePicture}
              onCheckedChange={(v) => setMakeProfilePicture(!!v)}
            />
            <Label htmlFor="profile">Set as Profile Picture</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
