import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";

import {
  factorySalesOrders,
  useFactoryStore,
  type FactoryCustomer,
} from "@/apps/factory/store";
import { ContactsPanel } from "@/apps/factory/views/customers/contacts";
import { Badge } from "@/components/ui/badge";

export type CustomerDetailViewKey =
  | "orderHistory"
  | "billingAddress"
  | "deliveryAddress"
  | "contacts"
  | "settings";

type CustomerDetailViewProps = {
  view: CustomerDetailViewKey;
};

const viewTitleKeys: Record<CustomerDetailViewKey, string> = {
  orderHistory: "factory.views.customerDetail.orderHistory.title",
  billingAddress: "factory.views.customerDetail.billingAddress.title",
  deliveryAddress: "factory.views.customerDetail.deliveryAddress.title",
  contacts: "factory.views.customerDetail.contacts.title",
  settings: "factory.views.customerDetail.settings.title",
};

export function CustomerDetailView({ view }: CustomerDetailViewProps) {
  const { t } = useTranslation();
  const { customerId } = useParams();
  const customer = useFactoryStore((state) =>
    state.customers.find((item) => item.id === customerId),
  );

  if (!customerId) {
    return <Navigate to="/apps/factory/customers" replace />;
  }

  if (!customer) {
    return (
      <section className="factory-view factory-customer-detail">
        <div className="factory-view-header">
          <div className="factory-view-header-start">
            <h2>{t("factory.views.customerDetail.notFound.title")}</h2>
            <p className="factory-view-subtitle">
              {t("factory.views.customerDetail.notFound.description")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="factory-view factory-customer-detail">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{customer.name}</h2>
          <p className="factory-view-subtitle">{t(viewTitleKeys[view])}</p>
        </div>
      </div>

      {view === "orderHistory" && <OrderHistory customer={customer} />}
      {view === "billingAddress" && <AddressPanel customer={customer} />}
      {view === "deliveryAddress" && <AddressPanel customer={customer} />}
      {view === "contacts" && <ContactsPanel customer={customer} />}
      {view === "settings" && <SettingsPanel customer={customer} />}
    </section>
  );
}

function OrderHistory({ customer }: { customer: FactoryCustomer }) {
  const { t } = useTranslation();
  const orders = factorySalesOrders.filter(
    (order) => order.customerName === customer.name,
  );

  if (orders.length === 0) {
    return (
      <div className="factory-detail-empty">
        {t("factory.views.customerDetail.orderHistory.empty")}
      </div>
    );
  }

  return (
    <div className="factory-detail-list">
      {orders.map((order) => (
        <article className="factory-detail-row" key={order.id}>
          <div>
            <h3>{order.orderNumber}</h3>
            <p>{order.poNumber}</p>
          </div>
          <Badge variant="secondary">{order.status}</Badge>
          <span className="factory-detail-row-value">
            {order.total.toLocaleString("en-AU", {
              style: "currency",
              currency: "AUD",
            })}
          </span>
        </article>
      ))}
    </div>
  );
}

function AddressPanel({ customer }: { customer: FactoryCustomer }) {
  return (
    <div className="factory-detail-card">
      <DetailField label="Address" value={customer.address} />
      <DetailField label="City" value={customer.city} />
      <DetailField label="State" value={customer.state} />
      <DetailField label="Post Code" value={customer.postCode} />
      <DetailField label="Country" value={customer.country} />
    </div>
  );
}

function SettingsPanel({ customer }: { customer: FactoryCustomer }) {
  return (
    <div className="factory-detail-card">
      <DetailField label="Customer ID" value={customer.id} />
      <DetailField label="Account Name" value={customer.name} />
      <DetailField label="Region" value={`${customer.city}, ${customer.state}`} />
    </div>
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
