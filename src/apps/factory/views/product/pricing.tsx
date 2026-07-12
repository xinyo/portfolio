import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  factorySuppliers,
  useFactoryStore,
} from "@/apps/factory/store";
import { getPricedSuppliers } from "@/apps/factory/views/product/model";
import {
  ProductNotFound,
  ProductViewHeader,
} from "@/apps/factory/views/product/shared";
import { useCurrentFactoryProduct } from "@/apps/factory/views/product/use-current-product";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PricingView = "buying" | "selling" | "tracking";

export function ProductPricingView() {
  const { t } = useTranslation();
  const { productId, product } = useCurrentFactoryProduct();
  const configuration = useFactoryStore((state) =>
    productId ? state.productConfigurations[productId] : undefined,
  );
  const [activeView, setActiveView] = useState<PricingView>("buying");

  if (!productId || !product) {
    return <ProductNotFound />;
  }

  const pricedSuppliers = getPricedSuppliers(
    factorySuppliers,
    configuration?.supplierIds ?? [],
    productId,
  );
  const views: PricingView[] = ["buying", "selling", "tracking"];

  return (
    <section className="factory-view factory-product-detail">
      <ProductViewHeader
        subtitle={t("factory.views.productDetail.pricing.title")}
        actions={
          <Button
            type="button"
            onClick={() =>
              toast.success(t("factory.views.productDetail.saved"))
            }
          >
            {t("factory.views.productDetail.save")}
          </Button>
        }
      />
      <ButtonGroup
        aria-label={t("factory.views.productDetail.pricing.viewLabel")}
      >
        {views.map((view) => (
          <Button
            type="button"
            size="sm"
            key={view}
            variant={activeView === view ? "default" : "outline"}
            aria-pressed={activeView === view}
            onClick={() => setActiveView(view)}
          >
            {t(`factory.views.productDetail.pricing.${view}`)}
          </Button>
        ))}
      </ButtonGroup>

      <div className="factory-product-pricing-table">
        {activeView === "buying" &&
          (pricedSuppliers.length === 0 ? (
            <div className="factory-detail-empty">
              {t("factory.views.productDetail.pricing.noSupplierPrices")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {pricedSuppliers.map(({ supplier }) => (
                    <TableHead key={supplier.id}>{supplier.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {pricedSuppliers.map(({ supplier, supplyPrice }) => (
                    <TableCell key={supplier.id}>
                      {supplyPrice.toLocaleString("en-AU", {
                        style: "currency",
                        currency: "AUD",
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          ))}
        {activeView === "selling" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("factory.views.productDetail.pricing.cost")}</TableHead>
                <TableHead>{t("factory.views.productDetail.pricing.markup")}</TableHead>
                <TableHead>{t("factory.views.productDetail.pricing.price")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>$24.80</TableCell>
                <TableCell>35%</TableCell>
                <TableCell>$33.48</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
        {activeView === "tracking" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("factory.views.productDetail.pricing.onHand")}</TableHead>
                <TableHead>{t("factory.views.productDetail.pricing.promised")}</TableHead>
                <TableHead>{t("factory.views.productDetail.pricing.available")}</TableHead>
                <TableHead>{t("factory.views.productDetail.pricing.onTheWay")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>128</TableCell>
                <TableCell>36</TableCell>
                <TableCell>92</TableCell>
                <TableCell>48</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
