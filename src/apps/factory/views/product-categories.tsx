import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ChevronDown, EllipsisVertical, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { ProductDialog } from "@/apps/factory/dialogs/product-dialog";
import { CategoryDialog } from "@/apps/factory/dialogs/category-dialog";
import { ProductKitDialog } from "@/apps/factory/dialogs/product-kit-dialog";
import {
  factoryProducts,
  factoryCategories,
  type FactoryProduct,
} from "@/apps/factory/store";

export function ProductCategoriesView() {
  const { t } = useTranslation();
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [productKitDialogOpen, setProductKitDialogOpen] = useState(false);

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.productCategories.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.productCategories.subtitle")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="size-4" />
              {t("factory.views.productCategories.addNew")}
              <ChevronDown className="size-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setProductDialogOpen(true)}>
              {t("factory.views.productCategories.addProduct")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategoryDialogOpen(true)}>
              {t("factory.views.productCategories.addCategory")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProductKitDialogOpen(true)}>
              {t("factory.views.productCategories.addProductKit")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="factory-view-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              placeholder={t(
                "factory.views.productCategories.searchPlaceholder",
              )}
              aria-label={t(
                "factory.views.productCategories.searchPlaceholder",
              )}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={t("factory.views.productCategories.filterByLabel")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("factory.views.productCategories.allLabels")}
              </SelectItem>
              <SelectItem value="label-a">Label A</SelectItem>
              <SelectItem value="label-b">Label B</SelectItem>
              <SelectItem value="label-c">Label C</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue
                placeholder={t(
                  "factory.views.productCategories.filterByCategory",
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("factory.views.productCategories.filterByCategory")}
              </SelectItem>
              {factoryCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="factory-product-list">
        {factoryProducts.map((product: FactoryProduct) => (
          <ProductItem key={product.id} product={product} t={t} />
        ))}
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
      />
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
      />
      <ProductKitDialog
        open={productKitDialogOpen}
        onOpenChange={setProductKitDialogOpen}
      />
    </section>
  );
}

function ProductItem({
  product,
  t,
}: {
  product: FactoryProduct;
  t: (key: string) => string;
}) {
  return (
    <Item variant="outline" size="default" className="factory-product-item">
      <Link
        className="factory-product-item-link u-press"
        to={`/apps/factory/product/${product.id}/product-options`}
      >
        <ItemMedia variant="image">
          <img src={product.image} alt={product.name} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{product.name}</ItemTitle>
          <ItemDescription>{product.code}</ItemDescription>
        </ItemContent>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("factory.views.productCategories.moreOptions")}
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            {t("factory.views.productCategories.duplicate")}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            {t("factory.views.productCategories.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Item>
  );
}
