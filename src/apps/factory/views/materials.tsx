import { EllipsisVertical, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { MaterialDialog } from "@/apps/factory/dialogs/material-dialog";
import { useFactoryListQuery } from "@/apps/factory/hooks/use-factory-list-query";
import { filterFactoryMaterials } from "@/apps/factory/material-model";
import { useFactoryStore, type FactoryMaterial } from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MaterialsView() {
  const { t } = useTranslation();
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [query, setQuery] = useFactoryListQuery();
  const materials = useFactoryStore((state) => state.materials);
  const filteredMaterials = filterFactoryMaterials(materials, query);

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.materials.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.materials.subtitle")}
          </p>
        </div>
        <Button onClick={() => setMaterialDialogOpen(true)}>
          <Plus className="size-4" />
          {t("factory.views.materials.addMaterial")}
        </Button>
      </div>

      <div className="factory-view-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              placeholder={t(
                "factory.views.materials.searchPlaceholder",
              )}
              aria-label={t(
                "factory.views.materials.searchPlaceholder",
              )}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={t("factory.views.materials.filterByLabel")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("factory.views.materials.allLabels")}
              </SelectItem>
              <SelectItem value="label-a">Label A</SelectItem>
              <SelectItem value="label-b">Label B</SelectItem>
              <SelectItem value="label-c">Label C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="factory-product-list">
        {filteredMaterials.length === 0 ? (
          <div className="factory-detail-empty">
            {t("factory.views.materials.empty")}
          </div>
        ) : (
          filteredMaterials.map((material: FactoryMaterial) => (
            <MaterialItem key={material.id} material={material} t={t} />
          ))
        )}
      </div>

      <MaterialDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
      />
    </section>
  );
}

function MaterialItem({
  material,
  t,
}: {
  material: FactoryMaterial;
  t: (key: string) => string;
}) {
  return (
    <Item variant="outline" size="default">
      <ItemMedia variant="image">
        <img src={material.image} alt={material.name} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{material.name}</ItemTitle>
        <ItemDescription>{material.code}</ItemDescription>
      </ItemContent>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More options">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            {t("factory.views.materials.duplicate")}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            {t("factory.views.materials.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Item>
  );
}
