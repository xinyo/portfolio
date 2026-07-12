import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useRandomProductImage } from "@/apps/factory/hooks/use-random-product-image";
import {
  hasValidationErrors,
  validateProductInput,
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyForm = { name: "", code: "", categoryId: "" };

export function ProductDialog({ open, onOpenChange }: ProductDialogProps) {
  const { t } = useTranslation();
  const categories = useFactoryStore((state) => state.categories);
  const addProduct = useFactoryStore((state) => state.addProduct);
  const randomProductImage = useRandomProductImage();
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateProductInput(form);

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

    addProduct({
      id: `prod-${crypto.randomUUID()}`,
      name: form.name.trim(),
      code: form.code.trim(),
      categoryId: form.categoryId,
      image: randomProductImage(),
    });
    toast.success(t("factory.views.productCategories.productCreated"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="factory-catalog-dialog-form" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {t("factory.views.productCategories.addProduct")}
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="factory-new-product-name">
                {t("factory.views.productCategories.productName")}
              </FieldLabel>
              <Input
                id="factory-new-product-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                aria-invalid={submitted && errors.name}
                aria-describedby={submitted && errors.name ? "product-name-error" : undefined}
              />
              {submitted && errors.name && (
                <FieldError id="product-name-error" role="alert">
                  {t("factory.views.productCategories.required")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="factory-new-product-code">
                {t("factory.views.productCategories.productCode")}
              </FieldLabel>
              <Input
                id="factory-new-product-code"
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                aria-invalid={submitted && errors.code}
                aria-describedby={submitted && errors.code ? "product-code-error" : undefined}
              />
              {submitted && errors.code && (
                <FieldError id="product-code-error" role="alert">
                  {t("factory.views.productCategories.required")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="factory-new-product-category">
                {t("factory.views.productCategories.category")}
              </FieldLabel>
              <Select
                value={form.categoryId}
                onValueChange={(categoryId) =>
                  setForm((current) => ({ ...current, categoryId }))
                }
              >
                <SelectTrigger
                  id="factory-new-product-category"
                  aria-invalid={submitted && errors.categoryId}
                >
                  <SelectValue
                    placeholder={t("factory.views.productDetail.selectOne")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {submitted && errors.categoryId && (
                <FieldError role="alert">
                  {t("factory.views.productCategories.required")}
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
