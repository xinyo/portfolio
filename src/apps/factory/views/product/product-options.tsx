import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  createEmptyProductConfiguration,
  factoryMaterials,
  useFactoryStore,
} from "@/apps/factory/store";
import {
  MultiSelect,
  ProductNotFound,
  ProductViewHeader,
} from "@/apps/factory/views/product/shared";
import { useCurrentFactoryProduct } from "@/apps/factory/views/product/use-current-product";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const switchFields = [
  ["buyItem", "buyItem"],
  ["sellItem", "sellItem"],
  ["trackStock", "trackStock"],
  ["trackCostsAndMarkups", "trackCostsAndMarkups"],
  ["taxFree", "taxFree"],
] as const;

const quantityUnits = [
  "basicQuantities",
  "linealMetres",
  "customFormula",
  "squareMetres",
] as const;

export function ProductOptionsView() {
  const { t } = useTranslation();
  const { productId, product } = useCurrentFactoryProduct();
  const savedConfiguration = useFactoryStore((state) =>
    productId ? state.productConfigurations[productId] : undefined,
  );
  const saveProductConfiguration = useFactoryStore(
    (state) => state.saveProductConfiguration,
  );
  const categories = useFactoryStore((state) => state.categories);
  const updateProductCategory = useFactoryStore(
    (state) => state.updateProductCategory,
  );
  const [draft, setDraft] = useState(
    () => savedConfiguration ?? createEmptyProductConfiguration(),
  );
  const [categoryId, setCategoryId] = useState(() => product?.categoryId ?? "");

  if (!productId || !product) {
    return <ProductNotFound />;
  }

  function save() {
    saveProductConfiguration(productId!, draft);
    updateProductCategory(productId!, categoryId);
    toast.success(t("factory.views.productDetail.saved"));
  }

  return (
    <section className="factory-view factory-product-detail">
      <ProductViewHeader
        subtitle={t("factory.views.productDetail.productOptions.title")}
      />
      <div className="factory-product-options-grid p-4">
        <FieldGroup>
          {switchFields.map(([key, labelKey]) => {
            const id = `factory-product-${key}`;
            return (
              <Field className="factory-product-switch-field" key={key}>
                <FieldLabel htmlFor={id}>
                  {t(`factory.views.productDetail.productOptions.${labelKey}`)}
                </FieldLabel>
                <Switch
                  id={id}
                  checked={draft[key]}
                  onCheckedChange={(checked) =>
                    setDraft((current) => ({ ...current, [key]: checked }))
                  }
                />
              </Field>
            );
          })}
        </FieldGroup>

        <Separator
          className="factory-product-form-separator"
          orientation="vertical"
        />

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="factory-product-quantity-unit">
              {t("factory.views.productDetail.productOptions.quantityUnit")}
            </FieldLabel>
            <Select
              value={draft.quantityUnit ?? undefined}
              onValueChange={(quantityUnit) =>
                setDraft((current) => ({ ...current, quantityUnit }))
              }
            >
              <SelectTrigger
                id="factory-product-quantity-unit"
                aria-label={t(
                  "factory.views.productDetail.productOptions.quantityUnit",
                )}
              >
                <SelectValue
                  placeholder={t("factory.views.productDetail.selectOne")}
                />
              </SelectTrigger>
              <SelectContent>
                {quantityUnits.map((unit) => (
                  <SelectItem value={unit} key={unit}>
                    {t(
                      `factory.views.productDetail.productOptions.quantityUnits.${unit}`,
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="factory-product-category">
              {t("factory.views.productDetail.productOptions.category")}
            </FieldLabel>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
            >
              <SelectTrigger
                id="factory-product-category"
                aria-label={t(
                  "factory.views.productDetail.productOptions.category",
                )}
              >
                <SelectValue
                  placeholder={t("factory.views.productDetail.selectOne")}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem value={category.id} key={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="factory-product-materials">
              {t("factory.views.productDetail.productOptions.materials")}
            </FieldLabel>
            <MultiSelect
              id="factory-product-materials"
              ariaLabel={t(
                "factory.views.productDetail.productOptions.materials",
              )}
              options={factoryMaterials.map((material) => ({
                value: material.id,
                label: material.name,
              }))}
              value={draft.materialIds}
              onValueChange={(materialIds) =>
                setDraft((current) => ({ ...current, materialIds }))
              }
              placeholder={t("factory.views.productDetail.selectMany")}
              searchPlaceholder={t("factory.views.productDetail.search")}
              emptyMessage={t("factory.views.productDetail.noResults")}
            />
          </Field>
        </FieldGroup>
      </div>
      <div className="factory-product-actions">
        <Button type="button" onClick={save}>
          {t("factory.views.productDetail.save")}
        </Button>
      </div>
    </section>
  );
}
