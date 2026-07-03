import "./styles.css";
import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Factory,
  LayoutDashboard,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Production", icon: Factory },
  { label: "Schedule", icon: CalendarClock },
  { label: "Tasks", icon: ClipboardList },
  { label: "Timers", icon: Timer },
];

export function FactoryApp() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <main className="factory-app-page">
      <Collapsible
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        className="factory-sidepanel"
        data-state={isPanelOpen ? "open" : "closed"}
      >
        <div className="factory-sidepanel-top">
          <CollapsibleContent className="factory-sidepanel-title">
            <span>Factory</span>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="factory-panel-toggle"
              aria-label={
                isPanelOpen
                  ? "Collapse navigation panel"
                  : "Expand navigation panel"
              }
            >
              {isPanelOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <nav className="factory-sidepanel-nav" aria-label="Factory navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button className="factory-nav-item" type="button" key={label}>
              <Icon aria-hidden="true" />
              <CollapsibleContent asChild>
                <span>{label}</span>
              </CollapsibleContent>
            </button>
          ))}
        </nav>
      </Collapsible>

      <section className="factory-app-workspace">
        <header className="app-view-header">Factory</header>
      </section>
    </main>
  );
}
