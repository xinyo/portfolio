import { describe, expect, it } from "vitest";

import {
  defaultNavigationSections,
  getFactoryLeftPanelModel,
  getSettingsNavigationSections,
} from "@/apps/factory/components/navigation-model";

describe("getSettingsNavigationSections", () => {
  it("returns the overview back link and every settings destination", () => {
    const sections = getSettingsNavigationSections();

    expect(sections[0]?.items).toMatchObject([
      {
        labelKey: "factory.navigation.contextual.settings.back",
        to: "/apps/factory",
        end: true,
        variant: "back",
      },
    ]);
    expect(sections[1]?.items.map(({ labelKey, to }) => ({ labelKey, to })))
      .toEqual([
        {
          labelKey: "factory.navigation.contextual.settings.company",
          to: "/apps/factory/settings/company",
        },
        {
          labelKey: "factory.navigation.contextual.settings.quotes",
          to: "/apps/factory/settings/quotes",
        },
        {
          labelKey:
            "factory.navigation.contextual.settings.orderConfirmation",
          to: "/apps/factory/settings/order-confirmation",
        },
        {
          labelKey: "factory.navigation.contextual.settings.invoicing",
          to: "/apps/factory/settings/invoicing",
        },
        {
          labelKey:
            "factory.navigation.contextual.settings.documentTemplates",
          to: "/apps/factory/settings/document-templates",
        },
        {
          labelKey: "factory.navigation.contextual.settings.pdfSettings",
          to: "/apps/factory/settings/pdf",
        },
        {
          labelKey: "factory.navigation.contextual.settings.orderImporter",
          to: "/apps/factory/settings/order-importer",
        },
      ]);
  });
});

describe("getFactoryLeftPanelModel settings routes", () => {
  it.each([
    "/apps/factory/settings",
    "/apps/factory/settings/company",
    "/apps/factory/settings/order-importer",
  ])("uses contextual settings navigation for %s", (pathname) => {
    expect(getFactoryLeftPanelModel(pathname)).toEqual({
      sections: getSettingsNavigationSections(),
      showSearch: true,
    });
  });

  it("keeps the default navigation for unrelated routes", () => {
    expect(getFactoryLeftPanelModel("/apps/factory/materials")).toEqual({
      sections: defaultNavigationSections,
      showSearch: true,
    });
  });
});
