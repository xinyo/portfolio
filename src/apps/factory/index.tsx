import {
  BellRing,
  BotMessageSquare,
  Menu,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, Route, Routes } from "react-router";

import { usePageTitle } from "@/hooks/use-page-title";
import logo from "./assets/logo.png";
import "./css/styles.css";

import { AiChat } from "@/apps/factory/components/ai-chat";
import { FactoryNavigations } from "@/apps/factory/components/navigations";
import { companyNameMap, useFactoryStore } from "@/apps/factory/store";
import { CustomerDetailView } from "@/apps/factory/views/customer-detail";
import { CustomersView } from "@/apps/factory/views/customers";
import { DeliverySchedulingView } from "@/apps/factory/views/delivery-scheduling";
import { IntegrationsView } from "@/apps/factory/views/integrations";
import { MaterialsView } from "@/apps/factory/views/materials";
import { OverviewView } from "@/apps/factory/views/overview";
import { PlannersView } from "@/apps/factory/views/planners";
import { PriceLevelManagerView } from "@/apps/factory/views/price-level-manager";
import { ProductCategoriesView } from "@/apps/factory/views/product-categories";
import { PurchaseOrdersView } from "@/apps/factory/views/purchase-orders";
import { SalesOrdersView } from "@/apps/factory/views/sales-orders";
import { SuppliersView } from "@/apps/factory/views/suppliers";
import { TeamView } from "@/apps/factory/views/team";
import { TimesheetsView } from "@/apps/factory/views/timesheets";
import { WorkflowView } from "@/apps/factory/views/workflow";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHAT_PANEL_MIN_WIDTH = 300;

function getChatPanelMaxWidth() {
  if (window.innerWidth > 1920) {
    return 800;
  }

  return window.innerWidth * 0.4;
}

function clampChatPanelWidth(width: number) {
  return Math.min(
    Math.max(width, CHAT_PANEL_MIN_WIDTH),
    getChatPanelMaxWidth(),
  );
}

export function FactoryApp() {
  const { t } = useTranslation();
  usePageTitle(t("factory.title"));
  const isNavPanelOpen = useFactoryStore((state) => state.isNavPanelOpen);
  const setIsNavPanelOpen = useFactoryStore((state) => state.setIsNavPanelOpen);
  const currentCompany = useFactoryStore((state) => state.currentCompany);
  const setCurrentCompany = useFactoryStore((state) => state.setCurrentCompany);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [chatPanelWidth, setChatPanelWidth] = useState(CHAT_PANEL_MIN_WIDTH);
  const [isResizingChatPanel, setIsResizingChatPanel] = useState(false);
  const pageStyle = {
    "--chat-panel-width": `${chatPanelWidth}px`,
  } as CSSProperties;

  useEffect(() => {
    document.body.classList.add("factory-app");

    return () => document.body.classList.remove("factory-app");
  }, []);

  useEffect(() => {
    if (!isResizingChatPanel) {
      return;
    }

    function handlePointerMove(event: globalThis.PointerEvent) {
      const nextWidth = window.innerWidth - event.clientX;

      setChatPanelWidth(clampChatPanelWidth(nextWidth));
    }

    function handlePointerUp() {
      setIsResizingChatPanel(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    document.body.classList.add("factory-chat-resizing");

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      document.body.classList.remove("factory-chat-resizing");
    };
  }, [isResizingChatPanel]);

  useEffect(() => {
    function handleWindowResize() {
      setChatPanelWidth((width) => clampChatPanelWidth(width));
    }

    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  function handleChatResizeStart(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsResizingChatPanel(true);
  }

  return (
    <main
      className="factory-app-page"
      data-chat-state={isChatPanelOpen ? "open" : "closed"}
      style={pageStyle}
    >
      <Collapsible
        open={isNavPanelOpen}
        onOpenChange={setIsNavPanelOpen}
        className="factory-sidepanel"
        data-state={isNavPanelOpen ? "open" : "closed"}
      >
        <div className="factory-sidepanel-top">
          {isNavPanelOpen && (
            <Link to="/apps/factory" aria-label="Home">
              <img
                src={logo}
                alt="Factory Logo"
                className="factory-sidepanel-logo"
              />
            </Link>
          )}
          <CollapsibleContent className="factory-sidepanel-title">
            <span>{t("factory.title")}</span>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="factory-panel-toggle"
              aria-label={
                isNavPanelOpen
                  ? t("factory.navigation.collapse")
                  : t("factory.navigation.expand")
              }
            >
              {isNavPanelOpen ? <PanelLeftClose /> : <Menu />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <FactoryNavigations />
      </Collapsible>

      <Collapsible
        open={isChatPanelOpen}
        onOpenChange={setIsChatPanelOpen}
        className="factory-chat-collapsible"
      >
        <section className="factory-app-workspace">
          <header className="app-view-header">
            <Select value={currentCompany} onValueChange={setCurrentCompany}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(companyNameMap.entries()).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Notifications"
              >
                <BellRing className="size-4" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={
                    isChatPanelOpen
                      ? t("factory.chat.collapse")
                      : t("factory.chat.expand")
                  }
                >
                  {isChatPanelOpen ? <PanelRightClose /> : <BotMessageSquare />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </header>
          <div className="app-view-content">
            <Routes>
              <Route index element={<OverviewView />} />
              <Route
                path="product-categories"
                element={<ProductCategoriesView />}
              />
              <Route path="materials" element={<MaterialsView />} />
              <Route path="sales-orders" element={<SalesOrdersView />} />
              <Route path="customers" element={<CustomersView />} />
              <Route
                path="customers/:customerId"
                element={<Navigate to="order-history" replace />}
              />
              <Route
                path="customers/:customerId/order-history"
                element={<CustomerDetailView view="orderHistory" />}
              />
              <Route
                path="customers/:customerId/billing-address"
                element={<CustomerDetailView view="billingAddress" />}
              />
              <Route
                path="customers/:customerId/delivery-address"
                element={<CustomerDetailView view="deliveryAddress" />}
              />
              <Route
                path="customers/:customerId/contacts"
                element={<CustomerDetailView view="contacts" />}
              />
              <Route
                path="customers/:customerId/settings"
                element={<CustomerDetailView view="settings" />}
              />
              <Route
                path="price-level-manager"
                element={<PriceLevelManagerView />}
              />
              <Route path="purchase-orders" element={<PurchaseOrdersView />} />
              <Route path="suppliers" element={<SuppliersView />} />
              <Route path="workflow" element={<WorkflowView />} />
              <Route path="planners" element={<PlannersView />} />
              <Route
                path="delivery-scheduling"
                element={<DeliverySchedulingView />}
              />
              <Route path="timesheets" element={<TimesheetsView />} />
              <Route path="integrations" element={<IntegrationsView />} />
              <Route path="team" element={<TeamView />} />
              <Route
                path="*"
                element={<Navigate to="/apps/factory" replace />}
              />
            </Routes>
          </div>
        </section>

        <CollapsibleContent className="factory-chat-panel">
          <div
            className="factory-chat-resize-handle"
            role="separator"
            aria-label={t("factory.chat.resize")}
            aria-orientation="vertical"
            aria-valuemin={CHAT_PANEL_MIN_WIDTH}
            aria-valuenow={chatPanelWidth}
            tabIndex={0}
            onPointerDown={handleChatResizeStart}
          />
          <div className="factory-chat-panel-header">
            <BotMessageSquare aria-hidden="true" />
            <span>{t("factory.chat.title")}</span>
          </div>
          <AiChat isOpen={isChatPanelOpen} />
        </CollapsibleContent>
      </Collapsible>
    </main>
  );
}
