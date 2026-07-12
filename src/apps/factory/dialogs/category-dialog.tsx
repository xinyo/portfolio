import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  hasValidationErrors,
  validateCategoryInput,
} from "@/apps/factory/product-catalog";
import { useFactoryStore } from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const { t } = useTranslation();
  const addCategory = useFactoryStore((state) => state.addCategory);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const errors = validateCategoryInput(name);

  useEffect(() => {
    if (open) {
      setName("");
      setSubmitted(false);
    }
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (hasValidationErrors(errors)) return;

    addCategory({ id: `cat-${crypto.randomUUID()}`, name: name.trim() });
    toast.success(t("factory.views.productCategories.categoryCreated"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="factory-catalog-dialog-form" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {t("factory.views.productCategories.addCategory")}
            </DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="factory-new-category-name">
              {t("factory.views.productCategories.categoryName")}
            </FieldLabel>
            <Input
              id="factory-new-category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={submitted && errors.name}
            />
            {submitted && errors.name && (
              <FieldError role="alert">
                {t("factory.views.productCategories.required")}
              </FieldError>
            )}
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("factory.views.productCategories.cancel")}
            </Button>
            <Button type="submit">
              {t("factory.views.productCategories.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
