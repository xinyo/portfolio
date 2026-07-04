import { create } from "zustand";

import mockData from "@/apps/factory/mock.json";

export const factoryLanguageOptions = ["English", "Deutsch", "中文"] as const;
export const factoryTimezoneOptions = ["UTC", "Local"] as const;

export type FactoryLanguage = (typeof factoryLanguageOptions)[number];
export type FactoryTimezone = (typeof factoryTimezoneOptions)[number];

type FactoryStore = {
  language: FactoryLanguage;
  timezone: FactoryTimezone;
  setLanguage: (language: FactoryLanguage) => void;
  setTimezone: (timezone: FactoryTimezone) => void;
};

function getInitialLanguage(): FactoryLanguage {
  return factoryLanguageOptions.includes(mockData.user.language as FactoryLanguage)
    ? (mockData.user.language as FactoryLanguage)
    : "English";
}

function getInitialTimezone(): FactoryTimezone {
  return factoryTimezoneOptions.includes(mockData.user.timezone as FactoryTimezone)
    ? (mockData.user.timezone as FactoryTimezone)
    : "Local";
}

export const useFactoryStore = create<FactoryStore>((set) => ({
  language: getInitialLanguage(),
  timezone: getInitialTimezone(),
  setLanguage: (language) => set({ language }),
  setTimezone: (timezone) => set({ timezone }),
}));
