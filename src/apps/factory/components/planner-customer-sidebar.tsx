import { Draggable } from "@fullcalendar/interaction";
import { GripVertical, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  filterPlannerCustomers,
  useFactoryStore,
  type FactoryCustomer,
} from "@/apps/factory/store";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function PlannerCustomerSidebar() {
  const { t } = useTranslation();
  const draggableContainerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const customers = useFactoryStore((s) => s.customers);

  const filteredCustomers = useMemo(
    () => filterPlannerCustomers(customers, query),
    [customers, query],
  );

  useEffect(() => {
    const container = draggableContainerRef.current;
    if (!container) return;

    const draggable = new Draggable(container, {
      itemSelector: ".factory-planner-customer",
      eventData: () => ({
        create: false,
        duration: "01:00",
      }),
    });

    return () => draggable.destroy();
  }, [filteredCustomers]);

  return (
    <section
      className="factory-planner-sidebar"
      aria-label={t("factory.views.planners.customerList")}
    >
      <div className="factory-planner-sidebar-header">
        <div>
          <h3>{t("factory.views.planners.customers")}</h3>
          <p>{t("factory.views.planners.dragHint")}</p>
        </div>
      </div>

      <div className="factory-search-input-wrapper factory-planner-search">
        <Search className="factory-search-input-icon" />
        <Input
          className="factory-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("factory.views.planners.searchPlaceholder")}
          aria-label={t("factory.views.planners.searchPlaceholder")}
        />
      </div>

      <div
        ref={draggableContainerRef}
        className="factory-planner-customer-list"
        role="list"
      >
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <PlannerCustomerItem key={customer.id} customer={customer} />
          ))
        ) : (
          <div className="factory-planner-empty">
            {t("factory.views.planners.noCustomers")}
          </div>
        )}
      </div>
    </section>
  );
}

function PlannerCustomerItem({ customer }: { customer: FactoryCustomer }) {
  return (
    <Item
      className="factory-planner-customer flex-nowrap"
      variant="outline"
      size="sm"
      role="listitem"
      tabIndex={0}
      data-customer-id={customer.id}
      aria-label={`Drag ${customer.name} to the planner calendar`}
    >
      <ItemMedia variant="image">
        <img src={customer.image} alt="" />
      </ItemMedia>
      <ItemContent className="truncate min-w-0">
        <ItemTitle title={customer.name}>{customer.name}</ItemTitle>
        <ItemDescription>
          {customer.city}, {customer.state}
        </ItemDescription>
      </ItemContent>
      <GripVertical
        className="factory-planner-customer-drag-icon"
        aria-hidden
      />
    </Item>
  );
}
