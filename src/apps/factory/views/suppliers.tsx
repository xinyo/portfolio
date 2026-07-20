import { Building2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useFactoryListQuery } from "@/apps/factory/hooks/use-factory-list-query";
import { filterFactorySuppliers } from "@/apps/factory/search-model";
import {
  factorySuppliers,
  useFactoryStore,
  type FactorySupplier,
} from "@/apps/factory/store";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function SuppliersView() {
  const { t } = useTranslation();
  const [query, setQuery] = useFactoryListQuery();
  const products = useFactoryStore((state) => state.products);
  const suppliers = filterFactorySuppliers(factorySuppliers, products, query);

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.suppliers.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.suppliers.subtitle")}
          </p>
        </div>
      </div>

      <div className="factory-view-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" aria-hidden="true" />
            <Input
              className="factory-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("factory.views.suppliers.searchPlaceholder")}
              aria-label={t("factory.views.suppliers.searchPlaceholder")}
            />
          </div>
        </div>
      </div>

      <div className="factory-product-list factory-supplier-list">
        {suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <SupplierItem key={supplier.id} supplier={supplier} />
          ))
        ) : (
          <p className="factory-detail-empty">
            {t("factory.views.suppliers.empty")}
          </p>
        )}
      </div>
    </section>
  );
}

function SupplierItem({ supplier }: { supplier: FactorySupplier }) {
  const { t } = useTranslation();
  const activeContactCount = supplier.contacts.filter(
    (contact) => !contact.archived,
  ).length;

  return (
    <Item variant="outline" size="default" className="factory-supplier-item">
      <ItemMedia variant={supplier.image ? "image" : "icon"}>
        {supplier.image ? (
          <img src={supplier.image} alt="" />
        ) : (
          <Building2 aria-hidden="true" />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{supplier.name}</ItemTitle>
        <ItemDescription>
          {[supplier.city, supplier.state, supplier.country]
            .filter(Boolean)
            .join(", ")}
        </ItemDescription>
      </ItemContent>
      <ItemContent className="factory-supplier-meta">
        <ItemDescription>
          {t("factory.views.suppliers.contacts", {
            count: activeContactCount,
          })}
        </ItemDescription>
        <ItemDescription>
          {t("factory.views.suppliers.products", {
            count: supplier.suppliedProducts.length,
          })}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
