import { create } from "zustand";
import type { Edge, Node, XYPosition } from "@xyflow/react";

import mockData from "@/apps/factory/mock.json";
import {
  comparePlainDate,
  instantToPlainDate,
  type FactoryTimesheetDateRange,
} from "@/apps/factory/timesheet-date";

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

function resolveAvatarImage(path: string): string {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/src/assets/avatar/${path}`;

  return resolveImage(normalizedPath);
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

export type FactoryEmployee = {
  id: string;
  image: string;
  name: string;
  accountType: string;
  email: string;
};

export type FactoryLocation = {
  id: string;
  name: string;
};

export type FactoryTimesheet = {
  id: string;
  startTime: string;
  endTime: string;
  empId: string;
  breakStart: string;
  breakEnd: string;
  location: string;
  comments: string[];
  status: string;
};

export type FactoryTimesheetStatusVariant = "pending" | "time" | "pay" | "muted";

export type FactoryTimesheetFilters = {
  dateRange: FactoryTimesheetDateRange;
  locationId: string;
  selectedEmployeeId: string | null;
  employeeQuery: string;
};

export type FactoryTimesheetIndexes = {
  employeesById: Record<string, FactoryEmployee>;
  locationsById: Record<string, FactoryLocation>;
  timesheetsByEmployeeId: Record<string, FactoryTimesheet[]>;
  timesheetsByLocationId: Record<string, FactoryTimesheet[]>;
};

export type FactoryWorkflowNodeType = "container" | "item";

export type FactoryWorkflowNodeData = {
  label: string;
  nodeType: FactoryWorkflowNodeType;
};

export type FactoryWorkflowNode = Node<
  FactoryWorkflowNodeData,
  FactoryWorkflowNodeType
>;

export type FactoryWorkflowEdge = Edge;

export type FactoryWorkflow = {
  id: string;
  name: string;
  nodes: FactoryWorkflowNode[];
  edges: FactoryWorkflowEdge[];
  savedAt: string | null;
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
export const factoryEmployees: FactoryEmployee[] = mockData.employees.map(
  (employee) => ({
    ...employee,
    image: resolveAvatarImage(employee.image),
  }),
);
export const factoryLocations: FactoryLocation[] = mockData.locations;
export const factoryTimesheets: FactoryTimesheet[] = mockData.timesheets;

export function createTimesheetIndexes(
  employees: FactoryEmployee[],
  locations: FactoryLocation[],
  timesheets: FactoryTimesheet[],
): FactoryTimesheetIndexes {
  return {
    employeesById: Object.fromEntries(
      employees.map((employee) => [employee.id, employee]),
    ),
    locationsById: Object.fromEntries(
      locations.map((location) => [location.id, location]),
    ),
    timesheetsByEmployeeId: timesheets.reduce<
      Record<string, FactoryTimesheet[]>
    >((index, timesheet) => {
      index[timesheet.empId] = [...(index[timesheet.empId] ?? []), timesheet];
      return index;
    }, {}),
    timesheetsByLocationId: timesheets.reduce<
      Record<string, FactoryTimesheet[]>
    >((index, timesheet) => {
      index[timesheet.location] = [
        ...(index[timesheet.location] ?? []),
        timesheet,
      ];
      return index;
    }, {}),
  };
}

export const factoryTimesheetIndexes = createTimesheetIndexes(
  factoryEmployees,
  factoryLocations,
  factoryTimesheets,
);

export function isTimesheetInDateRange(
  timesheet: FactoryTimesheet,
  dateRange: FactoryTimesheetDateRange,
  timeZone = "UTC",
) {
  let timesheetDate;
  try {
    timesheetDate = instantToPlainDate(timesheet.startTime, timeZone);
  } catch {
    return false;
  }

  if (dateRange.from && comparePlainDate(timesheetDate, dateRange.from) < 0) {
    return false;
  }

  if (dateRange.to && comparePlainDate(timesheetDate, dateRange.to) > 0) {
    return false;
  }

  return true;
}

export function getTimesheetStatusVariant(
  status: string,
): FactoryTimesheetStatusVariant {
  switch (status.trim().toLowerCase()) {
    case "pending":
      return "pending";
    case "time approved":
      return "time";
    case "pay approved":
      return "pay";
    default:
      return "muted";
  }
}

export function filterTimesheets(
  timesheets: FactoryTimesheet[],
  filters: Pick<
    FactoryTimesheetFilters,
    "dateRange" | "locationId" | "selectedEmployeeId"
  > & { timeZone?: string },
) {
  return timesheets.filter((timesheet) => {
    if (
      !isTimesheetInDateRange(timesheet, filters.dateRange, filters.timeZone)
    ) {
      return false;
    }

    if (filters.locationId !== "all" && timesheet.location !== filters.locationId) {
      return false;
    }

    if (
      filters.selectedEmployeeId &&
      timesheet.empId !== filters.selectedEmployeeId
    ) {
      return false;
    }

    return true;
  });
}

export function filterTimesheetEmployees(
  employees: FactoryEmployee[],
  timesheets: FactoryTimesheet[],
  filters: Pick<
    FactoryTimesheetFilters,
    "dateRange" | "locationId" | "employeeQuery"
  > & { timeZone?: string },
) {
  const normalizedQuery = filters.employeeQuery.trim().toLowerCase();
  const eligibleEmployeeIds = new Set(
    timesheets
      .filter((timesheet) =>
        filterTimesheets([timesheet], {
          dateRange: filters.dateRange,
          locationId: filters.locationId,
          selectedEmployeeId: null,
          timeZone: filters.timeZone,
        }).length > 0,
      )
      .map((timesheet) => timesheet.empId),
  );

  return employees.filter((employee) => {
    if (!eligibleEmployeeIds.has(employee.id)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [employee.name, employee.accountType, employee.email].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });
}

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

const WORKFLOW_CONTAINER_WIDTH = 280;
const WORKFLOW_CONTAINER_HEIGHT = 180;
const WORKFLOW_ITEM_WIDTH = 160;
const WORKFLOW_ITEM_HEIGHT = 72;
const WORKFLOW_CONTAINER_PADDING = 32;

let workflowIdCounter = 1;
let workflowNodeCounter = 0;
let workflowEdgeCounter = 0;

export const defaultWorkflow: FactoryWorkflow = {
  id: "workflow-default",
  name: "Production workflow",
  nodes: [
    createWorkflowNode("container", { x: 80, y: 80 }, "Assembly"),
    createWorkflowNode("item", { x: 32, y: 72 }, "Cut panels", {
      parentId: "workflow-node-container-1",
    }),
    createWorkflowNode("item", { x: 208, y: 72 }, "Quality check", {
      parentId: "workflow-node-container-1",
    }),
  ],
  edges: [],
  savedAt: null,
};

export function createWorkflowNode(
  type: FactoryWorkflowNodeType,
  position: XYPosition,
  label?: string,
  options?: { id?: string; parentId?: string },
): FactoryWorkflowNode {
  const nodeId =
    options?.id ?? `workflow-node-${type}-${++workflowNodeCounter}`;
  const isContainer = type === "container";

  return {
    id: nodeId,
    type,
    position,
    parentId: options?.parentId,
    data: {
      label: label ?? (isContainer ? "Container" : "Item"),
      nodeType: type,
    },
    style: isContainer
      ? {
          width: WORKFLOW_CONTAINER_WIDTH,
          height: WORKFLOW_CONTAINER_HEIGHT,
        }
      : {
          width: WORKFLOW_ITEM_WIDTH,
          height: WORKFLOW_ITEM_HEIGHT,
        },
  };
}

function getNodeWidth(node: FactoryWorkflowNode) {
  const width = node.measured?.width ?? node.width ?? node.style?.width;

  return typeof width === "number"
    ? width
    : node.data.nodeType === "container"
      ? WORKFLOW_CONTAINER_WIDTH
      : WORKFLOW_ITEM_WIDTH;
}

function getNodeHeight(node: FactoryWorkflowNode) {
  const height = node.measured?.height ?? node.height ?? node.style?.height;

  return typeof height === "number"
    ? height
    : node.data.nodeType === "container"
      ? WORKFLOW_CONTAINER_HEIGHT
      : WORKFLOW_ITEM_HEIGHT;
}

export function getAutoGrownWorkflowNodes(
  nodes: FactoryWorkflowNode[],
): FactoryWorkflowNode[] {
  return nodes.map((node) => {
    if (node.data.nodeType !== "container") {
      return node;
    }

    const children = nodes.filter((child) => child.parentId === node.id);
    if (children.length === 0) {
      return node;
    }

    const requiredWidth = Math.max(
      WORKFLOW_CONTAINER_WIDTH,
      ...children.map(
        (child) => child.position.x + getNodeWidth(child) + WORKFLOW_CONTAINER_PADDING,
      ),
    );
    const requiredHeight = Math.max(
      WORKFLOW_CONTAINER_HEIGHT,
      ...children.map(
        (child) =>
          child.position.y + getNodeHeight(child) + WORKFLOW_CONTAINER_PADDING,
      ),
    );

    return {
      ...node,
      style: {
        ...node.style,
        width: requiredWidth,
        height: requiredHeight,
      },
    };
  });
}

export function getWorkflowNodeParent(
  nodes: FactoryWorkflowNode[],
  position: XYPosition,
) {
  return nodes.find((node) => {
    if (node.data.nodeType !== "container") {
      return false;
    }

    const width = getNodeWidth(node);
    const height = getNodeHeight(node);

    return (
      position.x >= node.position.x &&
      position.x <= node.position.x + width &&
      position.y >= node.position.y &&
      position.y <= node.position.y + height
    );
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
  employees: FactoryEmployee[];
  locations: FactoryLocation[];
  timesheets: FactoryTimesheet[];
  timesheetIndexes: FactoryTimesheetIndexes;
  timesheetFilters: FactoryTimesheetFilters;
  customerBookings: Record<string, FactoryCustomerBooking>;
  workflows: FactoryWorkflow[];
  activeWorkflowId: string;
  workflowDraftDirty: boolean;
  selectedWorkflowElementId: string | null;
  setLanguage: (language: FactoryLanguage) => void;
  setTimezone: (timezone: FactoryTimezone) => void;
  setIsNavPanelOpen: (isOpen: boolean) => void;
  setCurrentCompany: (company: string) => void;
  setSalesOrderColumnViews: (views: FactoryColumnView[]) => void;
  setActiveSalesOrderViewId: (id: string) => void;
  addCustomer: (customer: FactoryCustomer) => void;
  updateCustomer: (id: string, data: Partial<FactoryCustomer>) => void;
  deleteCustomer: (id: string) => void;
  setTimesheetDateRange: (dateRange: FactoryTimesheetDateRange) => void;
  setTimesheetLocationId: (locationId: string) => void;
  setTimesheetSelectedEmployeeId: (employeeId: string | null) => void;
  setTimesheetEmployeeQuery: (query: string) => void;
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
  createWorkflow: (name?: string) => string;
  openWorkflow: (id: string) => void;
  saveActiveWorkflow: () => void;
  setWorkflowNodes: (nodes: FactoryWorkflowNode[]) => void;
  setWorkflowEdges: (edges: FactoryWorkflowEdge[]) => void;
  addWorkflowNode: (
    type: FactoryWorkflowNodeType,
    position: XYPosition,
    options?: { label?: string; parentId?: string },
  ) => string;
  updateWorkflowNodeLabel: (id: string, label: string) => void;
  addWorkflowEdge: (edge: Omit<FactoryWorkflowEdge, "id">) => string;
  deleteWorkflowElements: (ids: string[]) => void;
  duplicateSelectedWorkflowNode: () => void;
  clearActiveWorkflow: () => void;
  setSelectedWorkflowElementId: (id: string | null) => void;
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
    employees: [...factoryEmployees],
    locations: [...factoryLocations],
    timesheets: [...factoryTimesheets],
    timesheetIndexes: factoryTimesheetIndexes,
    timesheetFilters: {
      dateRange: {
        from: null,
        to: null,
      },
      locationId: "all",
      selectedEmployeeId: null,
      employeeQuery: "",
    },
    customerBookings: {},
    workflows: [defaultWorkflow],
    activeWorkflowId: defaultWorkflow.id,
    workflowDraftDirty: false,
    selectedWorkflowElementId: null,
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
    setTimesheetDateRange: (dateRange) =>
      set((state) => ({
        timesheetFilters: {
          ...state.timesheetFilters,
          dateRange,
        },
      })),
    setTimesheetLocationId: (locationId) =>
      set((state) => ({
        timesheetFilters: {
          ...state.timesheetFilters,
          locationId,
        },
      })),
    setTimesheetSelectedEmployeeId: (selectedEmployeeId) =>
      set((state) => ({
        timesheetFilters: {
          ...state.timesheetFilters,
          selectedEmployeeId,
        },
      })),
    setTimesheetEmployeeQuery: (employeeQuery) =>
      set((state) => ({
        timesheetFilters: {
          ...state.timesheetFilters,
          employeeQuery,
        },
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
    createWorkflow: (name) => {
      const id = `workflow-${++workflowIdCounter}`;
      const workflowName = name?.trim() || `Workflow ${workflowIdCounter}`;

      set((state) => ({
        workflows: [
          ...state.workflows,
          {
            id,
            name: workflowName,
            nodes: [],
            edges: [],
            savedAt: null,
          },
        ],
        activeWorkflowId: id,
        workflowDraftDirty: false,
        selectedWorkflowElementId: null,
      }));

      return id;
    },
    openWorkflow: (id) =>
      set((state) =>
        state.workflows.some((workflow) => workflow.id === id)
          ? {
              activeWorkflowId: id,
              workflowDraftDirty: false,
              selectedWorkflowElementId: null,
            }
          : state,
      ),
    saveActiveWorkflow: () =>
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? { ...workflow, savedAt: new Date().toISOString() }
            : workflow,
        ),
        workflowDraftDirty: false,
      })),
    setWorkflowNodes: (nodes) =>
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? {
                ...workflow,
                nodes: getAutoGrownWorkflowNodes(nodes),
              }
            : workflow,
        ),
        workflowDraftDirty: true,
      })),
    setWorkflowEdges: (edges) =>
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? { ...workflow, edges }
            : workflow,
        ),
        workflowDraftDirty: true,
      })),
    addWorkflowNode: (type, position, options) => {
      let addedId = "";

      set((state) => ({
        workflows: state.workflows.map((workflow) => {
          if (workflow.id !== state.activeWorkflowId) {
            return workflow;
          }

          const parent =
            options?.parentId && type === "item"
              ? workflow.nodes.find((node) => node.id === options.parentId)
              : type === "item"
                ? getWorkflowNodeParent(workflow.nodes, position)
                : undefined;
          const nextPosition = parent
            ? {
                x: Math.max(16, position.x - parent.position.x),
                y: Math.max(48, position.y - parent.position.y),
              }
            : position;
          const node = createWorkflowNode(type, nextPosition, options?.label, {
            parentId: parent?.id,
          });
          addedId = node.id;

          return {
            ...workflow,
            nodes: getAutoGrownWorkflowNodes([...workflow.nodes, node]),
          };
        }),
        workflowDraftDirty: true,
        selectedWorkflowElementId: addedId,
      }));

      return addedId;
    },
    updateWorkflowNodeLabel: (id, label) =>
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? {
                ...workflow,
                nodes: workflow.nodes.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, label } }
                    : node,
                ),
              }
            : workflow,
        ),
        workflowDraftDirty: true,
      })),
    addWorkflowEdge: (edge) => {
      const id = `workflow-edge-${++workflowEdgeCounter}`;

      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? {
                ...workflow,
                edges: [...workflow.edges, { ...edge, id }],
              }
            : workflow,
        ),
        workflowDraftDirty: true,
      }));

      return id;
    },
    deleteWorkflowElements: (ids) =>
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? {
                ...workflow,
                nodes: workflow.nodes.filter(
                  (node) => !ids.includes(node.id) && !ids.includes(node.parentId ?? ""),
                ),
                edges: workflow.edges.filter(
                  (edge) =>
                    !ids.includes(edge.id) &&
                    !ids.includes(edge.source) &&
                    !ids.includes(edge.target),
                ),
              }
            : workflow,
        ),
        workflowDraftDirty: true,
        selectedWorkflowElementId: null,
      })),
    duplicateSelectedWorkflowNode: () =>
      set((state) => {
        let selectedWorkflowElementId = state.selectedWorkflowElementId;

        return {
          workflows: state.workflows.map((workflow) => {
            if (workflow.id !== state.activeWorkflowId) {
              return workflow;
            }

            const node = workflow.nodes.find(
              (item) => item.id === state.selectedWorkflowElementId,
            );

            if (!node) {
              return workflow;
            }

            const duplicate = createWorkflowNode(
              node.data.nodeType,
              {
                x: node.position.x + 32,
                y: node.position.y + 32,
              },
              `${node.data.label} copy`,
              { parentId: node.parentId },
            );
            selectedWorkflowElementId = duplicate.id;

            return {
              ...workflow,
              nodes: getAutoGrownWorkflowNodes([...workflow.nodes, duplicate]),
            };
          }),
          workflowDraftDirty: true,
          selectedWorkflowElementId,
        };
      }),
    clearActiveWorkflow: () =>
      set((state) => ({
        workflows: state.workflows.map((workflow) =>
          workflow.id === state.activeWorkflowId
            ? { ...workflow, nodes: [], edges: [] }
            : workflow,
        ),
        workflowDraftDirty: true,
        selectedWorkflowElementId: null,
      })),
    setSelectedWorkflowElementId: (selectedWorkflowElementId) =>
      set({ selectedWorkflowElementId }),
  };
});
