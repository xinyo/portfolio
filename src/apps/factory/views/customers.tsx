import { EllipsisVertical, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { CustomerDialog } from "@/apps/factory/dialogs/customer-dialog";
import { useFactoryStore, type FactoryCustomer } from "@/apps/factory/store";
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

export function CustomersView() {
  const { t } = useTranslation();
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null,
  );
  const customers = useFactoryStore((s) => s.customers);
  const deleteCustomer = useFactoryStore((s) => s.deleteCustomer);

  function handleAdd() {
    setEditingCustomerId(null);
    setCustomerDialogOpen(true);
  }

  function handleEdit(id: string) {
    setEditingCustomerId(id);
    setCustomerDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setEditingCustomerId(null);
    }
    setCustomerDialogOpen(open);
  }

  return (
    <section className="factory-view">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.customers.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.customers.subtitle")}
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="size-4" />
          {t("factory.views.customers.addCustomer")}
        </Button>
      </div>

      <div className="factory-view-toolbar">
        <div className="factory-view-toolbar-start">
          <div className="factory-search-input-wrapper">
            <Search className="factory-search-input-icon" />
            <Input
              className="factory-search-input"
              placeholder={t("factory.views.customers.searchPlaceholder")}
              aria-label={t("factory.views.customers.searchPlaceholder")}
            />
          </div>
        </div>
      </div>

      <div className="factory-product-list">
        {customers.map((customer: FactoryCustomer) => (
          <CustomerItem
            key={customer.id}
            customer={customer}
            t={t}
            onEdit={handleEdit}
            onDelete={deleteCustomer}
          />
        ))}
      </div>

      <CustomerDialog
        open={customerDialogOpen}
        onOpenChange={handleDialogOpenChange}
        customerId={editingCustomerId}
      />
    </section>
  );
}

function CustomerItem({
  customer,
  t,
  onEdit,
  onDelete,
}: {
  customer: FactoryCustomer;
  t: (key: string) => string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Item className="factory-customer-item" variant="outline" size="default">
      <Link
        className="factory-customer-item-link"
        to={`/apps/factory/customers/${customer.id}/order-history`}
      >
        <ItemMedia variant="image">
          <img src={customer.image} alt={customer.name} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{customer.name}</ItemTitle>
          <ItemDescription>
            {customer.city}, {customer.state}
          </ItemDescription>
        </ItemContent>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More options">
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(customer.id)}>
            {t("factory.views.customers.edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(customer.id)}
          >
            {t("factory.views.customers.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Item>
  );
}
