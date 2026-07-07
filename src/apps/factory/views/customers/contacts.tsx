import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { FactoryCustomer } from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ContactsPanelProps = {
  customer: FactoryCustomer;
};

export function ContactsPanel({ customer }: ContactsPanelProps) {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <div className="factory-view-toolbar flex items-center gap-2">
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
        <Button>
          <Plus className="size-4" />
          {t("factory.views.customers.addCustomer")}
        </Button>
      </div>
    
    <div className="customer-contacts-list">
      <div className="factory-detail-card">
        <DetailField label="Primary Contact" value={customer.name} />
        <DetailField label="Phone" value={customer.phone} />
        <DetailField label="ABN" value={customer.abn} />
      </div>
    </div>
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="factory-detail-field">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}
