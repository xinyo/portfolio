import {
  Blend,
  Boxes,
  Building2,
  CalendarDays,
  Clock,
  Contact,
  CreditCard,
  DollarSign,
  FileCheck2,
  FileCog,
  FileInput,
  FileText,
  Files,
  History,
  House,
  MapPin,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
  Truck,
  Undo2,
  Users,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";

type NavIcon = ComponentType<{ "aria-hidden"?: boolean | "true" }>;

export type NavItem = {
  labelKey: string;
  to: string;
  icon: NavIcon;
  end?: boolean;
  variant?: "back";
};

export type NavSection = {
  labelKey?: string;
  items: NavItem[];
};

export type FactoryLeftPanelCustomSection = {
  id: "plannerCustomers" | "timesheetEmployees" | "workflowSidebar";
};

export type FactoryLeftPanelModel = {
  sections: NavSection[];
  customSection?: FactoryLeftPanelCustomSection;
  showSearch: boolean;
};

export const defaultNavigationSections: NavSection[] = [
  {
    labelKey: "factory.navigation.sections.general",
    items: [
      {
        labelKey: "factory.navigation.items.overview",
        to: "/apps/factory",
        icon: House,
        end: true,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.products",
    items: [
      {
        labelKey: "factory.navigation.items.productCategories",
        to: "/apps/factory/product-categories",
        icon: Package,
      },
      {
        labelKey: "factory.navigation.items.materials",
        to: "/apps/factory/materials",
        icon: Boxes,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.sales",
    items: [
      {
        labelKey: "factory.navigation.items.salesOrders",
        to: "/apps/factory/sales-orders",
        icon: ReceiptText,
      },
      {
        labelKey: "factory.navigation.items.customers",
        to: "/apps/factory/customers",
        icon: Contact,
      },
      {
        labelKey: "factory.navigation.items.priceLevelManager",
        to: "/apps/factory/price-level-manager",
        icon: DollarSign,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.purchasing",
    items: [
      {
        labelKey: "factory.navigation.items.purchaseOrders",
        to: "/apps/factory/purchase-orders",
        icon: ShoppingBag,
      },
      {
        labelKey: "factory.navigation.items.suppliers",
        to: "/apps/factory/suppliers",
        icon: Building2,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.productivity",
    items: [
      {
        labelKey: "factory.navigation.items.workflow",
        to: "/apps/factory/workflow",
        icon: Workflow,
      },
      {
        labelKey: "factory.navigation.items.planners",
        to: "/apps/factory/planners",
        icon: CalendarDays,
      },
      {
        labelKey: "factory.navigation.items.deliveryScheduling",
        to: "/apps/factory/delivery-scheduling",
        icon: Truck,
      },
      {
        labelKey: "factory.navigation.items.timesheets",
        to: "/apps/factory/timesheets",
        icon: Clock,
      },
      {
        labelKey: "factory.navigation.items.integrations",
        to: "/apps/factory/integrations",
        icon: Blend,
      },
    ],
  },
  {
    labelKey: "factory.navigation.sections.team",
    items: [
      {
        labelKey: "factory.navigation.items.team",
        to: "/apps/factory/team",
        icon: Users,
      },
    ],
  },
];

export function getCustomerIdFromPathname(pathname: string) {
  const match = pathname.match(/^\/apps\/factory\/customers\/([^/]+)/);

  return match?.[1] ?? null;
}

export function getCustomerNavigationSections(
  customerId: string,
): NavSection[] {
  const basePath = `/apps/factory/customers/${customerId}`;

  return [
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.customers.back",
          to: "/apps/factory/customers",
          icon: Undo2,
          end: true,
          variant: "back",
        },
      ],
    },
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.customers.orderHistory",
          to: `${basePath}/order-history`,
          icon: History,
        },
        {
          labelKey: "factory.navigation.contextual.customers.billingAddress",
          to: `${basePath}/billing-address`,
          icon: CreditCard,
        },
        {
          labelKey: "factory.navigation.contextual.customers.deliveryAddress",
          to: `${basePath}/delivery-address`,
          icon: MapPin,
        },
        {
          labelKey: "factory.navigation.contextual.customers.contacts",
          to: `${basePath}/contacts`,
          icon: Contact,
        },
        {
          labelKey: "factory.navigation.contextual.customers.settings",
          to: `${basePath}/settings`,
          icon: Settings,
        },
      ],
    },
  ];
}

export function getPlannerNavigationSections(): NavSection[] {
  return [
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.planners.back",
          to: "/apps/factory",
          icon: Undo2,
          end: true,
          variant: "back",
        },
      ],
    },
  ];
}

export function getTimesheetNavigationSections(): NavSection[] {
  return [
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.timesheets.back",
          to: "/apps/factory",
          icon: Undo2,
          end: true,
          variant: "back",
        },
      ],
    },
  ];
}

export function getWorkflowNavigationSections(): NavSection[] {
  return [
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.workflow.back",
          to: "/apps/factory",
          icon: Undo2,
          end: true,
          variant: "back",
        },
      ],
    },
  ];
}

export function getSettingsNavigationSections(): NavSection[] {
  const basePath = "/apps/factory/settings";

  return [
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.settings.back",
          to: "/apps/factory",
          icon: Undo2,
          end: true,
          variant: "back",
        },
      ],
    },
    {
      items: [
        {
          labelKey: "factory.navigation.contextual.settings.company",
          to: `${basePath}/company`,
          icon: Building2,
        },
        {
          labelKey: "factory.navigation.contextual.settings.quotes",
          to: `${basePath}/quotes`,
          icon: FileText,
        },
        {
          labelKey: "factory.navigation.contextual.settings.orderConfirmation",
          to: `${basePath}/order-confirmation`,
          icon: FileCheck2,
        },
        {
          labelKey: "factory.navigation.contextual.settings.invoicing",
          to: `${basePath}/invoicing`,
          icon: ReceiptText,
        },
        {
          labelKey: "factory.navigation.contextual.settings.documentTemplates",
          to: `${basePath}/document-templates`,
          icon: Files,
        },
        {
          labelKey: "factory.navigation.contextual.settings.pdfSettings",
          to: `${basePath}/pdf`,
          icon: FileCog,
        },
        {
          labelKey: "factory.navigation.contextual.settings.orderImporter",
          to: `${basePath}/order-importer`,
          icon: FileInput,
        },
      ],
    },
  ];
}

export function getFactoryLeftPanelModel(
  pathname: string,
): FactoryLeftPanelModel {
  const customerId = getCustomerIdFromPathname(pathname);

  if (customerId) {
    return {
      sections: getCustomerNavigationSections(customerId),
      showSearch: true,
    };
  }

  if (
    pathname === "/apps/factory/settings" ||
    pathname.startsWith("/apps/factory/settings/")
  ) {
    return {
      sections: getSettingsNavigationSections(),
      showSearch: true,
    };
  }

  if (pathname === "/apps/factory/planners") {
    return {
      sections: getPlannerNavigationSections(),
      customSection: { id: "plannerCustomers" },
      showSearch: false,
    };
  }

  if (pathname === "/apps/factory/timesheets") {
    return {
      sections: getTimesheetNavigationSections(),
      customSection: { id: "timesheetEmployees" },
      showSearch: false,
    };
  }

  if (pathname === "/apps/factory/workflow") {
    return {
      sections: getWorkflowNavigationSections(),
      customSection: { id: "workflowSidebar" },
      showSearch: false,
    };
  }

  return {
    sections: defaultNavigationSections,
    showSearch: true,
  };
}
