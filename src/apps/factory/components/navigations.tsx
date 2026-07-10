import { NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  CalendarClock,
  CreditCard,
  HelpCircleIcon,
  KeyboardIcon,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Search,
  Settings,
  Sparkles,
  Sun,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/apps/factory/components/search-dialog";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FactoryAvatar } from "@/apps/factory/components/Avatar";
import mockData from "@/apps/factory/mock.json";
import {
  factoryLanguageOptions,
  factoryTimezoneOptions,
  useFactoryStore,
  type FactoryLanguage,
  type FactoryTimezone,
} from "@/apps/factory/store";
import { PlannerCustomerSidebar } from "@/apps/factory/components/planner-customer-sidebar";
import { TimesheetEmployeeSidebar } from "@/apps/factory/components/timesheet-employee-sidebar";
import { WorkflowSidebar } from "@/apps/factory/components/workflow-sidebar";
import {
  getFactoryLeftPanelModel,
  type FactoryLeftPanelCustomSection,
  type NavSection,
} from "@/apps/factory/components/navigation-model";

export function FactoryNavigations() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, trial } = mockData;
  const { setIsDark } = useTheme(false);
  const leftPanelModel = getFactoryLeftPanelModel(location.pathname);

  const isNavPanelOpen = useFactoryStore((state) => state.isNavPanelOpen);
  const language = useFactoryStore((state) => state.language);
  const timezone = useFactoryStore((state) => state.timezone);
  const setLanguage = useFactoryStore((state) => state.setLanguage);
  const setTimezone = useFactoryStore((state) => state.setTimezone);

  return (
    <>
      <nav
        className="factory-sidepanel-nav"
        aria-label={t("factory.navigation.label")}
      >
        {leftPanelModel.showSearch && (
          <SearchDialog>
            <Button
              variant="ghost"
              className="factory-search-button"
              aria-label={t("factory.navigation.search")}
            >
              <span className="factory-search-button-content">
                <span className="factory-search-button-label">
                  <Search aria-hidden="true" />
                  {isNavPanelOpen && (
                    <span>{t("factory.navigation.search")}</span>
                  )}
                </span>
                {isNavPanelOpen && (
                  <span
                    className="factory-search-button-shortcut"
                    aria-hidden="true"
                  >
                    ⌘K
                  </span>
                )}
              </span>
            </Button>
          </SearchDialog>
        )}
        <NavSections sections={leftPanelModel.sections} />
        {leftPanelModel.customSection && isNavPanelOpen && (
          <CustomLeftPanelSection section={leftPanelModel.customSection} />
        )}
      </nav>

      <footer className="factory-sidepanel-footer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="factory-account-trigger"
              type="button"
              aria-label={t("factory.account.openMenu", { name: user.name })}
            >
              <FactoryAvatar avatar={user.avatar} name={user.name} />
              <CollapsibleContent asChild>
                <span className="factory-account-copy">
                  <span className="factory-account-name">{user.name}</span>
                  <span className="factory-account-type">
                    {user.accountType}
                  </span>
                </span>
              </CollapsibleContent>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="factory-account-menu"
            side="top"
            align="start"
            sideOffset={8}
          >
            <DropdownMenuItem>
              <User />
              {t("factory.account.menu.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              {t("factory.account.menu.billing")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              {t("factory.account.menu.settings")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette />
                {t("factory.account.menu.appearance")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onSelect={() => setIsDark(false)}>
                  <Sun />
                  {t("factory.account.menu.light")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsDark(true)}>
                  <Moon />
                  {t("factory.account.menu.dark")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsDark(false)}>
                  <Monitor />
                  {t("factory.account.menu.system")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Languages />
                {t("factory.account.menu.language")}
                <DropdownMenuShortcut>{language}</DropdownMenuShortcut>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={language}
                  onValueChange={(value) =>
                    setLanguage(value as FactoryLanguage)
                  }
                >
                  {factoryLanguageOptions.map((languageOption) => (
                    <DropdownMenuRadioItem
                      value={languageOption}
                      key={languageOption}
                    >
                      {languageOption}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CalendarClock />
                {t("factory.account.menu.timezone")}
                <DropdownMenuShortcut>{timezone}</DropdownMenuShortcut>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={timezone}
                  onValueChange={(value) =>
                    setTimezone(value as FactoryTimezone)
                  }
                >
                  {factoryTimezoneOptions.map((timezoneOption) => (
                    <DropdownMenuRadioItem
                      value={timezoneOption}
                      key={timezoneOption}
                    >
                      {timezoneOption === "Local"
                        ? t("factory.account.menu.local")
                        : timezoneOption}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HelpCircleIcon />
              {t("factory.account.menu.helpSupport")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <KeyboardIcon />
              {t("factory.account.menu.keyboardShortcuts")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="factory-account-upgrade">
              <Sparkles />
              {t("factory.account.menu.upgrade")}
              <Badge variant="secondary" className="ml-2">
                {trial.badgeLabel}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut />
              {t("factory.account.menu.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </footer>
    </>
  );
}

function NavSections({ sections }: { sections: NavSection[] }) {
  const { t } = useTranslation();

  return sections.map((section) => (
    <div
      className="factory-nav-section"
      key={section.labelKey ?? section.items[0]?.labelKey}
    >
      {section.labelKey && (
        <CollapsibleContent asChild>
          <p className="factory-nav-section-label">{t(section.labelKey)}</p>
        </CollapsibleContent>
      )}
      {section.items.map(({ labelKey, to, icon: Icon, end, variant }) => {
        const label = t(labelKey);

        return (
          <NavLink
            className="factory-nav-item u-press"
            to={to}
            end={end}
            title={label}
            key={labelKey}
            data-variant={variant}
          >
            <Icon aria-hidden="true" />
            <CollapsibleContent asChild>
              <span>{label}</span>
            </CollapsibleContent>
          </NavLink>
        );
      })}
    </div>
  ));
}

function CustomLeftPanelSection({
  section,
}: {
  section: FactoryLeftPanelCustomSection;
}) {
  const content =
    section.id === "plannerCustomers" ? (
      <PlannerCustomerSidebar />
    ) : section.id === "timesheetEmployees" ? (
      <TimesheetEmployeeSidebar />
    ) : (
      <WorkflowSidebar />
    );

  return (
    <CollapsibleContent
      className="factory-sidepanel-custom-section"
      data-custom-section={section.id}
    >
      {content}
    </CollapsibleContent>
  );
}
