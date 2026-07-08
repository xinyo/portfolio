import { create } from "zustand";

import mockData from "@/apps/factory/mock.json";

const avatarModules = import.meta.glob("@/assets/avatar/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const customerImageModules = import.meta.glob("@/assets/customer/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function resolveImage(path: string): string {
  return avatarModules[path] ?? customerImageModules[path] ?? path;
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
  abn: string;
  address: string;
  city: string;
  postCode: string;
  state: string;
  image: string;
  contacts: FactoryCustomerContact[];
};

export type FactoryCustomerContact = {
  id: string;
  contactName: string;
  email: string;
  phone: string;
  mobile: string;
  avatar: string;
  archived: boolean;
};

export type FactoryCustomerBooking = {
  id: string;
  customerId: string;
  customerName: string;
  start: string;
  end: string;
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
export const factoryAvatarOptions = Array.from({ length: 24 }, (_, index) => {
  const id = String(index + 1).padStart(2, "0");
  const path = `/src/assets/avatar/agent_avatar_${id}.svg`;

  return {
    id,
    path,
    src: resolveImage(path),
  };
});

export const factoryCustomers: FactoryCustomer[] = mockData.customers.map(
  (c) => ({
    ...c,
    image: resolveImage(c.image),
    contacts: c.contacts.map((contact) => ({
      ...contact,
      avatar: resolveImage(contact.avatar),
    })),
  }),
);
export const factorySalesOrders: FactorySalesOrder[] = mockData.salesOrders;

export function getActiveCustomerContacts(customer: FactoryCustomer) {
  return customer.contacts.filter((contact) => !contact.archived);
}

export function filterCustomerContacts(
  contacts: FactoryCustomerContact[],
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  const activeContacts = contacts.filter((contact) => !contact.archived);

  if (!normalizedQuery) {
    return activeContacts;
  }

  return activeContacts.filter((contact) =>
    [contact.contactName, contact.email, contact.phone, contact.mobile].some(
      (value) => value.toLowerCase().includes(normalizedQuery),
    ),
  );
}

export function filterPlannerCustomers(
  customers: FactoryCustomer[],
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return customers;
  }

  return customers.filter((customer) =>
    [customer.name, customer.city, customer.state, customer.country].some(
      (value) => value.toLowerCase().includes(normalizedQuery),
    ),
  );
}

export function hasCustomerBookingOverlap(
  bookings: Record<string, FactoryCustomerBooking>,
  booking: Pick<FactoryCustomerBooking, "start" | "end">,
) {
  const start = new Date(booking.start).getTime();
  const end = new Date(booking.end).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
    return true;
  }

  return Object.values(bookings).some((existing) => {
    const existingStart = new Date(existing.start).getTime();
    const existingEnd = new Date(existing.end).getTime();

    return start < existingEnd && end > existingStart;
  });
}

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
  customerBookings: Record<string, FactoryCustomerBooking>;
  setLanguage: (language: FactoryLanguage) => void;
  setTimezone: (timezone: FactoryTimezone) => void;
  setIsNavPanelOpen: (isOpen: boolean) => void;
  setCurrentCompany: (company: string) => void;
  setSalesOrderColumnViews: (views: FactoryColumnView[]) => void;
  setActiveSalesOrderViewId: (id: string) => void;
  addCustomer: (customer: FactoryCustomer) => void;
  updateCustomer: (id: string, data: Partial<FactoryCustomer>) => void;
  deleteCustomer: (id: string) => void;
  addCustomerBooking: (booking: FactoryCustomerBooking) => boolean;
  deleteCustomerBooking: (id: string) => void;
  addCustomerContact: (
    customerId: string,
    contact: FactoryCustomerContact,
  ) => void;
  updateCustomerContact: (
    customerId: string,
    contactId: string,
    data: Partial<FactoryCustomerContact>,
  ) => void;
  archiveCustomerContact: (customerId: string, contactId: string) => void;
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
    customerBookings: {},
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
    deleteCustomer: (id) =>
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        customerBookings: Object.fromEntries(
          Object.entries(state.customerBookings).filter(
            ([, booking]) => booking.customerId !== id,
          ),
        ),
      })),
    addCustomerBooking: (booking) => {
      let added = false;
      set((state) => {
        if (
          state.customerBookings[booking.id] ||
          hasCustomerBookingOverlap(state.customerBookings, booking)
        ) {
          return state;
        }

        added = true;
        return {
          customerBookings: {
            ...state.customerBookings,
            [booking.id]: booking,
          },
        };
      });

      return added;
    },
    deleteCustomerBooking: (id) =>
      set((state) => {
        if (!state.customerBookings[id]) {
          return state;
        }

        const { [id]: _deleted, ...customerBookings } =
          state.customerBookings;
        return { customerBookings };
      }),
    addCustomerContact: (customerId, contact) =>
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === customerId
            ? { ...customer, contacts: [...customer.contacts, contact] }
            : customer,
        ),
      })),
    updateCustomerContact: (customerId, contactId, data) =>
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                contacts: customer.contacts.map((contact) =>
                  contact.id === contactId ? { ...contact, ...data } : contact,
                ),
              }
            : customer,
        ),
      })),
    archiveCustomerContact: (customerId, contactId) =>
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                contacts: customer.contacts.map((contact) =>
                  contact.id === contactId
                    ? { ...contact, archived: true }
                    : contact,
                ),
              }
            : customer,
        ),
      })),
  };
});
