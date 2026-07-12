import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useCurrentFactoryProduct } from "@/apps/factory/views/product/use-current-product";
import {
  formatMultiSelectValue,
  type MultiSelectOption,
} from "@/apps/factory/views/product/multi-select-model";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ProductNotFound() {
  const { t } = useTranslation();

  return (
    <section className="factory-view factory-product-detail">
      <div className="factory-view-header">
        <div className="factory-view-header-start">
          <h2>{t("factory.views.productDetail.notFound.title")}</h2>
          <p className="factory-view-subtitle">
            {t("factory.views.productDetail.notFound.description")}
          </p>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link to="/apps/factory/product-categories">
          {t("factory.navigation.contextual.products.back")}
        </Link>
      </Button>
    </section>
  );
}

export function ProductViewHeader({ subtitle }: { subtitle: string }) {
  const { product } = useCurrentFactoryProduct();

  return (
    <div className="factory-view-header">
      <div className="factory-view-header-start">
        <h2>{product?.name}</h2>
        <p className="factory-view-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

export function MultiSelect({
  id,
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  ariaLabel,
}: {
  id: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyMessage: string;
  ariaLabel: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const displayValue = formatMultiSelectValue(
    options,
    value,
    placeholder,
    (count) => t("factory.views.productDetail.moreSelected", { count }),
  );

  function toggleValue(optionValue: string) {
    onValueChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          className="factory-multi-select-trigger"
        >
          <span>{displayValue}</span>
          <ChevronsUpDown aria-hidden="true" className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="factory-multi-select-content">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const selected = value.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    data-checked={selected}
                    onSelect={() => toggleValue(option.value)}
                  >
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
