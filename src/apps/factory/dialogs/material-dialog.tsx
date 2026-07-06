import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

type MaterialDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MaterialDialog({ open, onOpenChange }: MaterialDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("factory.views.materials.addMaterial")}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("factory.views.materials.cancel")}
          </Button>
          <Button type="submit">
            {t("factory.views.materials.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
