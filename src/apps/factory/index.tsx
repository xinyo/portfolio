import {
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
import { Navigate, Route, Routes, useLocation } from "react-router";
import "./styles.css";
import logo from "./assets/logo.png";

import { AiChat } from "@/apps/factory/components/ai-chat";
import { FactoryNavigations } from "@/apps/factory/components/navigations";
import { OverviewView } from "@/apps/factory/views/overview";
import { ProductsView } from "@/apps/factory/views/products";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useFactoryStore } from "@/apps/factory/store";

const factoryViewTitles = [
  {
    path: "/apps/factory/products",
    titleKey: "factory.views.products.title",
  },
  {
    path: "/apps/factory",
    titleKey: "factory.views.overview.title",
  },
];

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
  const { pathname } = useLocation();
  const isNavPanelOpen = useFactoryStore((state) => state.isNavPanelOpen);
  const setIsNavPanelOpen = useFactoryStore((state) => state.setIsNavPanelOpen);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [chatPanelWidth, setChatPanelWidth] = useState(CHAT_PANEL_MIN_WIDTH);
  const [isResizingChatPanel, setIsResizingChatPanel] = useState(false);
  const activeView = factoryViewTitles.find(({ path }) => pathname === path);
  const viewTitle = t(activeView?.titleKey ?? "factory.views.overview.title");
  const pageStyle = {
    "--factory-chat-panel-width": `${chatPanelWidth}px`,
  } as CSSProperties;

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
            <img
              src={logo}
              alt="Factory Logo"
              className="factory-sidepanel-logo"
            />
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
            <span>{viewTitle}</span>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="factory-chat-toggle"
                aria-label={
                  isChatPanelOpen
                    ? t("factory.chat.collapse")
                    : t("factory.chat.expand")
                }
              >
                {isChatPanelOpen ? <PanelRightClose /> : <BotMessageSquare />}
              </Button>
            </CollapsibleTrigger>
          </header>
          <div className="app-view-content">
            <Routes>
              <Route index element={<OverviewView />} />
              <Route path="products" element={<ProductsView />} />
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
