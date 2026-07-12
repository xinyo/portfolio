import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  hasValidationErrors,
  validateProductKitInput,
} from "@/apps/factory/product-catalog";
import { useFactoryStore } from "@/apps/factory/store";
import { MultiSelect } from "@/apps/factory/views/product/shared";
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

type ProductKitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyForm = { name: "", categoryId: "", productIds: [] as string[] };

export function ProductKitDialog({ open, onOpenChange }: ProductKitDialogProps) {
  const { t } = useTranslation();
  const products = useFactoryStore((state) => state.products);
  const categories = useFactoryStore((state) => state.categories);
  const addProductKit = useFactoryStore((state) => state.addProductKit);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const errors = validateProductKitInput(form);

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

    addProductKit({
      id: `kit-${crypto.randomUUID()}`,
      name: form.name.trim(),
      categoryId: form.categoryId,
      productIds: form.productIds,
    });
    toast.success(t("factory.views.productCategories.productKitCreated"));
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="factory-catalog-dialog-form" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {t("factory.views.productCategories.addProductKit")}
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="factory-new-kit-name">
                {t("factory.views.productCategories.kitName")}
              </FieldLabel>
              <Input
                id="factory-new-kit-name"
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
                  {t("factory.views.productCategories.required")}
                </FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="factory-new-kit-category">
                {t("factory.views.productCategories.category")}
              </FieldLabel>
              <Select
                value={form.categoryId}
                onValueChange={(categoryId) =>
                  setForm((current) => ({ ...current, categoryId }))
                }
              >
                <SelectTrigger
                  id="factory-new-kit-category"
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
            <Field>
              <FieldLabel htmlFor="factory-new-kit-products">
                {t("factory.views.productCategories.kitProducts")}
              </FieldLabel>
              <MultiSelect
                id="factory-new-kit-products"
                ariaLabel={t("factory.views.productCategories.kitProducts")}
                options={products.map((product) => ({
                  value: product.id,
                  label: product.name,
                }))}
                value={form.productIds}
                onValueChange={(productIds) =>
                  setForm((current) => ({ ...current, productIds }))
                }
                placeholder={t("factory.views.productDetail.selectMany")}
                searchPlaceholder={t("factory.views.productDetail.search")}
                emptyMessage={t("factory.views.productDetail.noResults")}
              />
              {submitted && errors.productIds && (
                <FieldError role="alert">
                  {t("factory.views.productCategories.selectProduct")}
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
