import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { validateMaterialInput } from "@/apps/factory/material-model";
import { hasValidationErrors } from "@/apps/factory/product-catalog";
import { useFactoryStore } from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type MaterialDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyForm = { name: "", code: "", image: "" };

export function MaterialDialog({ open, onOpenChange }: MaterialDialogProps) {
  const { t } = useTranslation();
  const addMaterial = useFactoryStore((state) => state.addMaterial);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateMaterialInput(form);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setSubmitted(false);
    }
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (hasValidationErrors(errors)) return;

    addMaterial({
      id: `mat-${crypto.randomUUID()}`,
      name: form.name.trim(),
      code: form.code.trim(),
      image: form.image.trim(),
    });
    toast.success(t("factory.views.materials.created"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="factory-catalog-dialog-form" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{t("factory.views.materials.addMaterial")}</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="factory-new-material-name">
                {t("factory.views.materials.materialName")}
              </FieldLabel>
              <Input
                id="factory-new-material-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                aria-invalid={submitted && errors.name}
              />
              {submitted && errors.name && (
                <FieldError role="alert">
                  {t("factory.views.materials.required")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="factory-new-material-code">
                {t("factory.views.materials.materialCode")}
              </FieldLabel>
              <Input
                id="factory-new-material-code"
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                aria-invalid={submitted && errors.code}
              />
              {submitted && errors.code && (
                <FieldError role="alert">
                  {t("factory.views.materials.required")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="factory-new-material-image">
                {t("factory.views.materials.imageUrl")}
              </FieldLabel>
              <Input
                id="factory-new-material-image"
                type="url"
                value={form.image}
                placeholder="https://example.com/material.jpg"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    image: event.target.value,
                  }))
                }
                aria-invalid={submitted && errors.image}
              />
              {submitted && errors.image && (
                <FieldError role="alert">
                  {t("factory.views.materials.required")}
                </FieldError>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("factory.views.materials.cancel")}
            </Button>
            <Button type="submit">{t("factory.views.materials.save")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
