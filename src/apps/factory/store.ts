import { create } from "zustand";

import mockData from "@/apps/factory/mock.json";

const avatarModules = import.meta.glob("@/assets/avatar/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function resolveImage(path: string): string {
  return avatarModules[path] ?? path;
}

export const factoryLanguageOptions = ["English", "Deutsch", "中文"] as const;
export const factoryTimezoneOptions = ["UTC", "Local"] as const;

export type FactoryLanguage = (typeof factoryLanguageOptions)[number];
export type FactoryTimezone = (typeof factoryTimezoneOptions)[number];

export const companyNameMap = new Map<string, string>([
  ["acme-corp", "Acme Corporation"],
  ["tech-solutions", "Tech Solutions Inc."],
  ["global-manufacturing", "Global Manufacturing Co."],
  ["precision-parts", "Precision Parts Ltd."],
]);

export type FactoryProduct = {
  id: string;
  name: string;
  code: string;
  image: string;
};

export type FactoryCategory = {
  id: string;
  name: string;
};

export type FactoryProductKit = {
  id: string;
  name: string;
  productIds: string[];
};

export type FactoryMaterial = {
  id: string;
  name: string;
  code: string;
  image: string;
};

export type FactoryCustomer = {
  id: string;
  name: string;
  country: string;
  phone: string;
  abn: string;
  address: string;
  city: string;
  postCode: string;
  state: string;
  image: string;
};

export type FactorySalesOrder = {
  id: string;
  orderNumber: string;
  poNumber: string;
  total: number;
  createdBy: string;
  invoiceStatus: string;
  paymentStatus: string;
  status: string;
  contactEmail: string;
  contactMobile: string;
  contactPhone: string;
  invoicedToDate: number;
  labourActual: number;
  labourEstimated: number;
  createdDate: string;
  toBeInvoiced: number;
  customerName: string;
  totalLinkedPoCostExclTax: number;
  assignedTo: string;
  billingAddress: string;
  contactName: string;
  cost: number;
  deliveryAddress: string;
  deliveryFee: number;
  hoursEstimated: number;
  hoursWorked: number;
  installAddress: string;
  invoicedDate: string;
  labels: string[];
  lastModifiedBy: string;
  lastModifiedDate: string;
  linkedOrders: string[];
  margin: number;
  notes: string;
  orderType: string;
  pickUpNotes: string;
  requiredDate: string;
  totalExclTax: number;
};

export const factoryProducts: FactoryProduct[] = mockData.products;
export const factoryCategories: FactoryCategory[] = mockData.categories;
export const factoryProductKits: FactoryProductKit[] = mockData.productKits;
export const factoryMaterials: FactoryMaterial[] = mockData.materials;
export const factoryCustomers: FactoryCustomer[] = mockData.customers.map(
  (c) => ({ ...c, image: resolveImage(c.image) }),
);
export const factorySalesOrders: FactorySalesOrder[] = mockData.salesOrders;

export type FactoryColumnView = {
  id: string;
  name: string;
  columnVisibility: Record<string, boolean>;
};

export const defaultSalesOrderColumnViews: FactoryColumnView[] = [
  {
    id: "default",
    name: "All columns",
    columnVisibility: {},
  },
];

type FactoryStore = {
  language: FactoryLanguage;
  timezone: FactoryTimezone;
  isNavPanelOpen: boolean;
  currentCompany: string;
  salesOrderColumnViews: FactoryColumnView[];
  activeSalesOrderViewId: string;
  customers: FactoryCustomer[];
  setLanguage: (language: FactoryLanguage) => void;
  setTimezone: (timezone: FactoryTimezone) => void;
  setIsNavPanelOpen: (isOpen: boolean) => void;
  setCurrentCompany: (company: string) => void;
  setSalesOrderColumnViews: (views: FactoryColumnView[]) => void;
  setActiveSalesOrderViewId: (id: string) => void;
  addCustomer: (customer: FactoryCustomer) => void;
  updateCustomer: (id: string, data: Partial<FactoryCustomer>) => void;
};

function getInitialLanguage(): FactoryLanguage {
  return factoryLanguageOptions.includes(
    mockData.user.language as FactoryLanguage,
  )
    ? (mockData.user.language as FactoryLanguage)
    : "English";
}

function getInitialTimezone(): FactoryTimezone {
  return factoryTimezoneOptions.includes(
    mockData.user.timezone as FactoryTimezone,
  )
    ? (mockData.user.timezone as FactoryTimezone)
    : "Local";
}

export const useFactoryStore = create<FactoryStore>((set) => {
  const initialCompany = Array.from(companyNameMap.keys())[0] || "acme-corp";
  return {
    language: getInitialLanguage(),
    timezone: getInitialTimezone(),
    isNavPanelOpen: true,
    currentCompany: initialCompany,
    salesOrderColumnViews: defaultSalesOrderColumnViews,
    activeSalesOrderViewId: "default",
    customers: [...factoryCustomers],
    setLanguage: (language) => set({ language }),
    setTimezone: (timezone) => set({ timezone }),
    setIsNavPanelOpen: (isNavPanelOpen) => set({ isNavPanelOpen }),
    setCurrentCompany: (currentCompany) => set({ currentCompany }),
    setSalesOrderColumnViews: (salesOrderColumnViews) =>
      set({ salesOrderColumnViews }),
    setActiveSalesOrderViewId: (activeSalesOrderViewId) =>
      set({ activeSalesOrderViewId }),
    addCustomer: (customer) =>
      set((state) => ({ customers: [...state.customers, customer] })),
    updateCustomer: (id, data) =>
      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === id ? { ...c, ...data } : c,
        ),
      })),
  };
});
