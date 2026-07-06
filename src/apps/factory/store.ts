import { create } from "zustand";

import mockData from "@/apps/factory/mock.json";

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

export const factoryProducts: FactoryProduct[] = mockData.products;
export const factoryCategories: FactoryCategory[] = mockData.categories;
export const factoryProductKits: FactoryProductKit[] = mockData.productKits;
export const factoryMaterials: FactoryMaterial[] = mockData.materials;

type FactoryStore = {
  language: FactoryLanguage;
  timezone: FactoryTimezone;
  isNavPanelOpen: boolean;
  currentCompany: string;
  setLanguage: (language: FactoryLanguage) => void;
  setTimezone: (timezone: FactoryTimezone) => void;
  setIsNavPanelOpen: (isOpen: boolean) => void;
  setCurrentCompany: (company: string) => void;
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
    setLanguage: (language) => set({ language }),
    setTimezone: (timezone) => set({ timezone }),
    setIsNavPanelOpen: (isNavPanelOpen) => set({ isNavPanelOpen }),
    setCurrentCompany: (currentCompany) => set({ currentCompany }),
  };
});
