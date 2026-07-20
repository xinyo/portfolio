import type { VisibilityState } from "@tanstack/react-table";
import { Columns3, ListFilter, Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ViewSelector } from "@/apps/factory/components/view-selector";
import { SalesOrderDialog } from "@/apps/factory/dialogs/sales-order-dialog";
import { useFactoryListQuery } from "@/apps/factory/hooks/use-factory-list-query";
import { filterFactorySalesOrders } from "@/apps/factory/search-model";
import {
  factorySalesOrders,
  useFactoryStore,
  type FactoryColumnView,
} from "@/apps/factory/store";
import { salesOrderColumns } from "@/apps/factory/views/sales-orders/columns";
import { DataTable } from "@/apps/factory/views/sales-orders/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const makeId = () =>
  `view_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export function SalesOrdersView() {
  const { t } = useTranslation();
  const [salesOrderDialogOpen, setSalesOrderDialogOpen] = useState(false);
  const [query, setQuery] = useFactoryListQuery();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const {
    salesOrderColumnViews,
    activeSalesOrderViewId,
    setSalesOrderColumnViews,
    setActiveSalesOrderViewId,
  } = useFactoryStore();

  const activeView = useMemo(
    () =>
      salesOrderColumnViews.find((v) => v.id === activeSalesOrderViewId) ??
      null,
    [salesOrderColumnViews, activeSalesOrderViewId],
  );

  const isModified = useMemo(() => {
    if (!activeView) return true;
    return (
      JSON.stringify(columnVisibility) !==
      JSON.stringify(activeView.columnVisibility)
    );
  }, [columnVisibility, activeView]);

  const handleSelectView = useCallback(
    (id: string) => {
      const view = salesOrderColumnViews.find((v) => v.id === id);
      if (!view) return;
      setActiveSalesOrderViewId(id);
      setColumnVisibility(view.columnVisibility);
    },
    [salesOrderColumnViews, setActiveSalesOrderViewId],
  );

  const handleSaveNewView = useCallback(
    (name: string) => {
      const id = makeId();
      const newView: FactoryColumnView = {
        id,
        name,
        columnVisibility,
      };
      setSalesOrderColumnViews([...salesOrderColumnViews, newView]);
      setActiveSalesOrderViewId(id);
    },
    [
      columnVisibility,
      salesOrderColumnViews,
      setSalesOrderColumnViews,
      setActiveSalesOrderViewId,
    ],
  );

  const handleUpdateView = useCallback(
    (id: string) => {
      setSalesOrderColumnViews(
        salesOrderColumnViews.map((v) =>
          v.id === id ? { ...v, columnVisibility } : v,
        ),
      );
    },
    [columnVisibility, salesOrderColumnViews, setSalesOrderColumnViews],
  );

  const handleDeleteView = useCallback(
    (id: string) => {
      setSalesOrderColumnViews(
        salesOrderColumnViews.filter((v) => v.id !== id),
      );
      if (activeSalesOrderViewId === id) {
        const remaining = salesOrderColumnViews.filter((v) => v.id !== id);
        if (remaining.length > 0) {
          setActiveSalesOrderViewId(remaining[0].id);
          setColumnVisibility(remaining[0].columnVisibility);
        }
      }
    },
    [
      salesOrderColumnViews,
      activeSalesOrderViewId,
      setSalesOrderColumnViews,
      setActiveSalesOrderViewId,
    ],
  );

  const toggleableColumns = salesOrderColumns.filter(
    (col) => col.enableHiding !== false,
  );
  const filteredSalesOrders = filterFactorySalesOrders(
    factorySalesOrders,
    query,
  );

  const toolbar = (
    <div className="flex items-center gap-2">
      <div className="factory-search-input-wrapper flex-1">
        <Search className="factory-search-input-icon" />
        <Input
          className="factory-search-input"
          placeholder={t("factory.views.salesOrders.searchPlaceholder")}
          aria-label={t("factory.views.salesOrders.searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <Button variant="outline" size="icon" aria-label="Filters">
        <ListFilter className="size-4" />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 font-normal">
            <Columns3 className="size-4" />
            {t("factory.views.salesOrders.columns")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="end">
          <div className="flex flex-col gap-1">
            {toggleableColumns.map((col) => {
              const colId = col.id!;
              return (
                <div
                  key={colId}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent"
                >
                  <Checkbox
                    id={`col-${colId}`}
                    checked={
                      columnVisibility[colId] !== false
                    }
                    onCheckedChange={(checked) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [colId]: checked === false ? false : true,
                      }))
                    }
                  />
                  <Label
                    htmlFor={`col-${colId}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {typeof col.header === "string" ? col.header : colId}
                  </Label>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <ViewSelector
        views={salesOrderColumnViews}
        activeViewId={activeSalesOrderViewId}
        isModified={isModified}
        onSelectView={handleSelectView}
        onSaveNewView={handleSaveNewView}
        onUpdateView={handleUpdateView}
        onDeleteView={handleDeleteView}
      />
    </div>
  );

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.salesOrders.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.salesOrders.subtitle")}
          </p>
        </div>
        <Button onClick={() => setSalesOrderDialogOpen(true)}>
          <Plus className="size-4" />
          {t("factory.views.salesOrders.createOrder")}
        </Button>
      </div>

      <DataTable
        columns={salesOrderColumns}
        data={filteredSalesOrders}
        toolbar={toolbar}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />

      <SalesOrderDialog
        open={salesOrderDialogOpen}
        onOpenChange={setSalesOrderDialogOpen}
      />
    </section>
  );
}
