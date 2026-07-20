import type {
  FactoryCategory,
  FactoryCustomer,
  FactoryEmployee,
  FactoryIntegration,
  FactoryIntegrationCategory,
  FactoryMaterial,
  FactoryProduct,
  FactoryProductKit,
  FactorySalesOrder,
  FactorySupplier,
  FactoryUser,
} from "@/apps/factory/store";

export type FactorySearchKind =
  | "page"
  | "product"
  | "productKit"
  | "customer"
  | "contact"
  | "salesOrder"
  | "material"
  | "supplier"
  | "teamMember"
  | "integration";

export type FactorySearchOption = {
  id: string;
  kind: FactorySearchKind;
  title: string;
  subtitle?: string;
  keywords: string[];
  href: string;
};

export type FactorySearchPage = Pick<
  FactorySearchOption,
  "id" | "title" | "subtitle" | "href"
>;

export type FactorySearchSource = {
  pages: FactorySearchPage[];
  products: FactoryProduct[];
  productKits: FactoryProductKit[];
  categories: FactoryCategory[];
  customers: FactoryCustomer[];
  salesOrders: FactorySalesOrder[];
  materials: FactoryMaterial[];
  suppliers: FactorySupplier[];
  user: FactoryUser;
  employees: FactoryEmployee[];
  integrations: FactoryIntegration[];
  integrationCategories: FactoryIntegrationCategory[];
};

const SEARCH_RESULTS_PER_KIND = 5;

export function createFactoryListSearchHref(pathname: string, query: string) {
  const searchParams = new URLSearchParams();
  searchParams.set("q", query);
  return `${pathname}?${searchParams.toString()}`;
}

export function updateFactorySearchQuery(
  currentSearchParams: URLSearchParams,
  query: string,
) {
  const nextSearchParams = new URLSearchParams(currentSearchParams);

  if (query.trim()) {
    nextSearchParams.set("q", query);
  } else {
    nextSearchParams.delete("q");
  }

  return nextSearchParams;
}

export function buildFactorySearchOptions(
  source: FactorySearchSource,
): FactorySearchOption[] {
  const categoriesById = Object.fromEntries(
    source.categories.map((category) => [category.id, category]),
  );
  const productsById = Object.fromEntries(
    source.products.map((product) => [product.id, product]),
  );
  const integrationCategoriesById = Object.fromEntries(
    source.integrationCategories.map((category) => [category.id, category]),
  );

  const pageOptions: FactorySearchOption[] = source.pages.map((page) => ({
    ...page,
    kind: "page",
    keywords: [page.title, page.subtitle ?? ""],
  }));

  const productOptions: FactorySearchOption[] = source.products.map(
    (product) => {
      const categoryName = categoriesById[product.categoryId]?.name;
      return {
        id: `product:${product.id}`,
        kind: "product",
        title: product.name,
        subtitle: [product.code, categoryName].filter(Boolean).join(" · "),
        keywords: [product.name, product.code, categoryName ?? ""],
        href: `/apps/factory/product/${product.id}/product-options`,
      };
    },
  );

  const kitOptions: FactorySearchOption[] = source.productKits.map((kit) => {
    const categoryName = categoriesById[kit.categoryId]?.name;
    const productNames = kit.productIds.flatMap((productId) => {
      const product = productsById[productId];
      return product ? [product.name, product.code] : [];
    });
    return {
      id: `productKit:${kit.id}`,
      kind: "productKit",
      title: kit.name,
      subtitle: categoryName,
      keywords: [kit.name, categoryName ?? "", ...productNames],
      href: createFactoryListSearchHref(
        "/apps/factory/product-categories",
        kit.name,
      ),
    };
  });

  const customerOptions: FactorySearchOption[] = source.customers.flatMap(
    (customer) => {
      const customerOption: FactorySearchOption = {
        id: `customer:${customer.id}`,
        kind: "customer",
        title: customer.name,
        subtitle: [customer.city, customer.state].filter(Boolean).join(", "),
        keywords: [
          customer.name,
          customer.abn,
          customer.address,
          customer.city,
          customer.state,
          customer.postCode,
          customer.country,
        ],
        href: `/apps/factory/customers/${customer.id}/order-history`,
      };
      const contactOptions: FactorySearchOption[] = customer.contacts
        .filter((contact) => !contact.archived)
        .map((contact) => ({
          id: `contact:${contact.id}`,
          kind: "contact",
          title: contact.contactName,
          subtitle: customer.name,
          keywords: [
            contact.contactName,
            contact.email,
            contact.phone,
            contact.mobile,
            customer.name,
          ],
          href: createFactoryListSearchHref(
            `/apps/factory/customers/${customer.id}/contacts`,
            contact.contactName,
          ),
        }));
      return [customerOption, ...contactOptions];
    },
  );

  const salesOrderOptions: FactorySearchOption[] = source.salesOrders.map(
    (order) => ({
      id: `salesOrder:${order.id}`,
      kind: "salesOrder",
      title: order.orderNumber,
      subtitle: [order.customerName, order.status].filter(Boolean).join(" · "),
      keywords: [
        order.orderNumber,
        order.poNumber,
        order.customerName,
        order.assignedTo,
        order.createdBy,
        order.status,
        order.invoiceStatus,
        order.paymentStatus,
        order.contactName,
        order.contactEmail,
        order.contactPhone,
        order.contactMobile,
        order.orderType,
        order.notes,
        ...order.labels,
      ],
      href: createFactoryListSearchHref(
        "/apps/factory/sales-orders",
        order.orderNumber,
      ),
    }),
  );

  const materialOptions: FactorySearchOption[] = source.materials.map(
    (material) => ({
      id: `material:${material.id}`,
      kind: "material",
      title: material.name,
      subtitle: material.code,
      keywords: [material.name, material.code],
      href: createFactoryListSearchHref(
        "/apps/factory/materials",
        material.name,
      ),
    }),
  );

  const supplierOptions: FactorySearchOption[] = source.suppliers.map(
    (supplier) => {
      const contactKeywords = supplier.contacts.flatMap((contact) => [
        contact.contactName,
        contact.email,
        contact.phone,
        contact.mobile,
      ]);
      const suppliedProductKeywords = supplier.suppliedProducts.flatMap(
        ({ productId }) => {
          const product = productsById[productId];
          return product ? [product.name, product.code] : [];
        },
      );
      return {
        id: `supplier:${supplier.id}`,
        kind: "supplier",
        title: supplier.name,
        subtitle: [supplier.city, supplier.state].filter(Boolean).join(", "),
        keywords: [
          supplier.name,
          supplier.abn,
          supplier.address,
          supplier.city,
          supplier.state,
          supplier.postCode,
          supplier.country,
          ...contactKeywords,
          ...suppliedProductKeywords,
        ],
        href: createFactoryListSearchHref(
          "/apps/factory/suppliers",
          supplier.name,
        ),
      };
    },
  );

  const teamOptions: FactorySearchOption[] = [
    {
      id: source.user.id,
      name: source.user.name,
      email: source.user.email,
      accountType: source.user.accountType,
    },
    ...source.employees,
  ].map((member) => ({
    id: `teamMember:${member.id}`,
    kind: "teamMember",
    title: member.name,
    subtitle: member.accountType,
    keywords: [member.name, member.email, member.accountType],
    href: createFactoryListSearchHref("/apps/factory/team", member.name),
  }));

  const integrationOptions: FactorySearchOption[] = source.integrations.map(
    (integration) => {
      const category = integrationCategoriesById[integration.category];
      return {
        id: `integration:${integration.id}`,
        kind: "integration",
        title: integration.name,
        subtitle: category?.name,
        keywords: [
          integration.name,
          integration.description,
          category?.name ?? "",
          category?.group ?? "",
        ],
        href: createFactoryListSearchHref(
          "/apps/factory/integrations",
          integration.name,
        ),
      };
    },
  );

  return [
    ...pageOptions,
    ...productOptions,
    ...kitOptions,
    ...customerOptions,
    ...salesOrderOptions,
    ...materialOptions,
    ...supplierOptions,
    ...teamOptions,
    ...integrationOptions,
  ];
}

export function filterFactorySearchOptions(
  options: FactorySearchOption[],
  query: string,
) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  const rankedOptions = options
    .map((option, index) => ({
      option,
      index,
      score: getSearchScore(option, normalizedQuery),
    }))
    .filter((result) => result.score !== null)
    .sort((left, right) =>
      left.score === right.score
        ? left.index - right.index
        : left.score! - right.score!,
    );
  const countsByKind = new Map<FactorySearchKind, number>();

  return rankedOptions.flatMap(({ option }) => {
    const count = countsByKind.get(option.kind) ?? 0;
    if (count >= SEARCH_RESULTS_PER_KIND) {
      return [];
    }
    countsByKind.set(option.kind, count + 1);
    return [option];
  });
}

export function filterFactoryCustomers(
  customers: FactoryCustomer[],
  query: string,
) {
  return filterBySearchValues(customers, query, (customer) => [
    customer.name,
    customer.abn,
    customer.address,
    customer.city,
    customer.state,
    customer.postCode,
    customer.country,
  ]);
}

export function filterFactorySalesOrders(
  salesOrders: FactorySalesOrder[],
  query: string,
) {
  return filterBySearchValues(salesOrders, query, (order) => [
    order.orderNumber,
    order.poNumber,
    order.customerName,
    order.assignedTo,
    order.createdBy,
    order.status,
    order.invoiceStatus,
    order.paymentStatus,
    order.contactName,
    order.contactEmail,
    order.contactPhone,
    order.contactMobile,
    order.orderType,
    order.notes,
    ...order.labels,
  ]);
}

export function filterFactorySuppliers(
  suppliers: FactorySupplier[],
  products: FactoryProduct[],
  query: string,
) {
  const productsById = Object.fromEntries(
    products.map((product) => [product.id, product]),
  );
  return filterBySearchValues(suppliers, query, (supplier) => [
    supplier.name,
    supplier.abn,
    supplier.address,
    supplier.city,
    supplier.state,
    supplier.postCode,
    supplier.country,
    ...supplier.contacts.flatMap((contact) => [
      contact.contactName,
      contact.email,
      contact.phone,
      contact.mobile,
    ]),
    ...supplier.suppliedProducts.flatMap(({ productId }) => {
      const product = productsById[productId];
      return product ? [product.name, product.code] : [];
    }),
  ]);
}

function filterBySearchValues<T>(
  values: T[],
  query: string,
  getValues: (value: T) => string[],
) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return values;
  }
  return values.filter((value) =>
    getValues(value).some((candidate) =>
      normalizeSearchValue(candidate).includes(normalizedQuery),
    ),
  );
}

function getSearchScore(
  option: FactorySearchOption,
  normalizedQuery: string,
) {
  const values = [option.title, ...option.keywords].map(normalizeSearchValue);
  if (values.some((value) => value === normalizedQuery)) return 0;
  if (values.some((value) => value.startsWith(normalizedQuery))) return 1;
  if (values.some((value) => value.includes(normalizedQuery))) return 2;
  return null;
}

function normalizeSearchValue(value: string) {
  return value.trim().toLocaleLowerCase();
}
