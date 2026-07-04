import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  CalendarClock,
  ClipboardList,
  CreditCard,
  Factory,
  Languages,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sparkles,
  Sun,
  Timer,
  User,
} from "lucide-react";

import { CollapsibleContent } from "@/components/ui/collapsible";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FactoryAvatar } from "@/apps/factory/components/Avatar";
import mockData from "@/apps/factory/mock.json";

const navigationItems = [
  {
    labelKey: "factory.navigation.items.overview",
    to: "/apps/factory",
    icon: LayoutDashboard,
    end: true,
  },
  {
    labelKey: "factory.navigation.items.production",
    to: "/apps/factory/production",
    icon: Factory,
  },
  {
    labelKey: "factory.navigation.items.schedule",
    to: "/apps/factory/schedule",
    icon: CalendarClock,
  },
  {
    labelKey: "factory.navigation.items.tasks",
    to: "/apps/factory/tasks",
    icon: ClipboardList,
  },
  {
    labelKey: "factory.navigation.items.timers",
    to: "/apps/factory/timers",
    icon: Timer,
  },
];

export function FactoryNavigations() {
  const { t } = useTranslation();
  const { user } = mockData;
  const { setIsDark } = useTheme(false);

  return (
    <>
      <nav
        className="factory-sidepanel-nav"
        aria-label={t("factory.navigation.label")}
      >
        {navigationItems.map(({ labelKey, to, icon: Icon, end }) => {
          const label = t(labelKey);

          return (
            <NavLink
              className="factory-nav-item"
              to={to}
              end={end}
              title={label}
              key={labelKey}
            >
              <Icon aria-hidden="true" />
              <CollapsibleContent asChild>
                <span>{label}</span>
              </CollapsibleContent>
            </NavLink>
          );
        })}
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
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Deutsch</DropdownMenuItem>
                <DropdownMenuItem>中文</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <CalendarClock />
                {t("factory.account.menu.timezone")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>UTC</DropdownMenuItem>
                <DropdownMenuItem>
                  {t("factory.account.menu.local")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="factory-account-upgrade">
              <Sparkles />
              {t("factory.account.menu.upgrade")}
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
