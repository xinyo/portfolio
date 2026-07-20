import {
  Boxes,
  Building2,
  Contact,
  FileText,
  Package,
  PanelsTopLeft,
  Plug,
  ReceiptText,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { defaultNavigationSections } from "@/apps/factory/components/navigation-model";
import {
  buildFactorySearchOptions,
  filterFactorySearchOptions,
  type FactorySearchKind,
} from "@/apps/factory/search-model";
import {
  factoryIntegrationCategories,
  factorySalesOrders,
  factorySuppliers,
  useFactoryStore,
} from "@/apps/factory/store";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SearchDialogProps = {
  children: React.ReactNode;
};

const searchGroupOrder: FactorySearchKind[] = [
  "page",
  "product",
  "productKit",
  "customer",
  "contact",
  "salesOrder",
  "material",
  "supplier",
  "teamMember",
  "integration",
];

const searchKindIcons = {
  page: PanelsTopLeft,
  product: Package,
  productKit: Boxes,
  customer: Contact,
  contact: UserRound,
  salesOrder: ReceiptText,
  material: FileText,
  supplier: Building2,
  teamMember: Users,
  integration: Plug,
} satisfies Record<FactorySearchKind, typeof Package>;

export function SearchDialog({ children }: SearchDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const products = useFactoryStore((state) => state.products);
  const productKits = useFactoryStore((state) => state.productKits);
  const categories = useFactoryStore((state) => state.categories);
  const customers = useFactoryStore((state) => state.customers);
  const materials = useFactoryStore((state) => state.materials);
  const user = useFactoryStore((state) => state.user);
  const employees = useFactoryStore((state) => state.employees);
  const integrationsById = useFactoryStore((state) => state.integrationsById);

  const pages = useMemo(
    () =>
      defaultNavigationSections.flatMap((section) =>
        section.items.map((item) => ({
          id: `page:${item.to}`,
          title: t(item.labelKey),
          subtitle: section.labelKey ? t(section.labelKey) : undefined,
          href: item.to,
        })),
      ),
    [t],
  );
  const options = useMemo(
    () =>
      buildFactorySearchOptions({
        pages,
        products,
        productKits,
        categories,
        customers,
        salesOrders: factorySalesOrders,
        materials,
        suppliers: factorySuppliers,
        user,
        employees,
        integrations: Object.values(integrationsById),
        integrationCategories: factoryIntegrationCategories,
      }),
    [
      categories,
      customers,
      employees,
      integrationsById,
      materials,
      pages,
      productKits,
      products,
      user,
    ],
  );
  const results = useMemo(
    () => filterFactorySearchOptions(options, query),
    [options, query],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (isModifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setQuery("");
    }
  }

  function handleSelect(href: string) {
    handleOpenChange(false);
    navigate(href);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="factory-global-search sm:max-w-xl"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("factory.search.title")}</DialogTitle>
          <DialogDescription>
            {t("factory.search.description")}
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            placeholder={t("factory.search.placeholder")}
            aria-label={t("factory.search.inputLabel")}
          />
          <CommandList>
            {query.trim() && results.length === 0 ? (
              <CommandEmpty>{t("factory.search.noResults")}</CommandEmpty>
            ) : null}
            {query.trim()
              ? searchGroupOrder.map((kind) => {
                  const groupResults = results.filter(
                    (option) => option.kind === kind,
                  );
                  if (groupResults.length === 0) return null;
                  const Icon = searchKindIcons[kind];
                  return (
                    <CommandGroup
                      key={kind}
                      heading={t(`factory.search.groups.${kind}`)}
                    >
                      {groupResults.map((option) => (
                        <CommandItem
                          key={option.id}
                          value={option.id}
                          onSelect={() => handleSelect(option.href)}
                        >
                          <Icon aria-hidden="true" />
                          <span className="factory-global-search-copy">
                            <span>{option.title}</span>
                            {option.subtitle ? (
                              <span>{option.subtitle}</span>
                            ) : null}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  );
                })
              : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
