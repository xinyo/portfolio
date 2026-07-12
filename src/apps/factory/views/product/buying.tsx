import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  createEmptyProductConfiguration,
  factorySuppliers,
  useFactoryStore,
} from "@/apps/factory/store";
import {
  MultiSelect,
  ProductNotFound,
  ProductViewHeader,
} from "@/apps/factory/views/product/shared";
import { removeUnavailablePreferredSupplier } from "@/apps/factory/views/product/model";
import { useCurrentFactoryProduct } from "@/apps/factory/views/product/use-current-product";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProductBuyingView() {
  const { t } = useTranslation();
  const { productId, product } = useCurrentFactoryProduct();
  const savedConfiguration = useFactoryStore((state) =>
    productId ? state.productConfigurations[productId] : undefined,
  );
  const saveProductConfiguration = useFactoryStore(
    (state) => state.saveProductConfiguration,
  );
  const [draft, setDraft] = useState(
    () => savedConfiguration ?? createEmptyProductConfiguration(),
  );
  const selectedSuppliers = factorySuppliers.filter((supplier) =>
    draft.supplierIds.includes(supplier.id),
  );

  if (!productId || !product) {
    return <ProductNotFound />;
  }

  function updateSuppliers(supplierIds: string[]) {
    setDraft((current) => ({
      ...current,
      supplierIds,
      preferredSupplierId: removeUnavailablePreferredSupplier(
        supplierIds,
        current.preferredSupplierId,
      ),
    }));
  }

  function save() {
    saveProductConfiguration(productId!, draft);
    toast.success(t("factory.views.productDetail.saved"));
  }

  return (
    <section className="factory-view factory-product-detail">
      <ProductViewHeader
        subtitle={t("factory.views.productDetail.buying.title")}
      />
      <FieldGroup className="factory-product-buying-form">
        <Field>
          <FieldLabel htmlFor="factory-product-suppliers">
            {t("factory.views.productDetail.buying.suppliers")}
          </FieldLabel>
          <MultiSelect
            id="factory-product-suppliers"
            ariaLabel={t("factory.views.productDetail.buying.suppliers")}
            options={factorySuppliers.map((supplier) => ({
              value: supplier.id,
              label: supplier.name,
            }))}
            value={draft.supplierIds}
            onValueChange={updateSuppliers}
            placeholder={t("factory.views.productDetail.selectMany")}
            searchPlaceholder={t("factory.views.productDetail.search")}
            emptyMessage={t("factory.views.productDetail.noResults")}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="factory-product-preferred-supplier">
            {t("factory.views.productDetail.buying.preferredSupplier")}
          </FieldLabel>
          <Select
            value={draft.preferredSupplierId ?? undefined}
            onValueChange={(preferredSupplierId) =>
              setDraft((current) => ({
                ...current,
                preferredSupplierId,
              }))
            }
            disabled={selectedSuppliers.length === 0}
          >
            <SelectTrigger
              id="factory-product-preferred-supplier"
              aria-label={t(
                "factory.views.productDetail.buying.preferredSupplier",
              )}
            >
              <SelectValue
                placeholder={t("factory.views.productDetail.selectOne")}
              />
            </SelectTrigger>
            <SelectContent>
              {selectedSuppliers.map((supplier) => (
                <SelectItem value={supplier.id} key={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>
      <div className="factory-product-actions">
        <Button type="button" onClick={save}>
          {t("factory.views.productDetail.save")}
        </Button>
      </div>
    </section>
  );
}
