import { afterEach, describe, expect, it } from "vitest";

import {
  FACTORY_CUSTOM_COMPANY_ID,
  FACTORY_CUSTOM_COMPANY_STORAGE_KEY,
  FACTORY_LOADING_TOTAL_TICKS,
  getFactoryLoadingProgress,
  isFactoryOnboardingComplete,
  normalizeFactoryWelcomeValues,
  readFactoryCustomCompany,
  removeFactoryCustomCompany,
  splitFactoryWelcomeName,
  validateFactoryWelcomeValues,
  writeFactoryCustomCompany,
} from "@/apps/factory/onboarding";
import {
  companyNameMap,
  factoryUser,
  useFactoryStore,
} from "@/apps/factory/store";

function createStorage(initialValue: string | null = null) {
  let value = initialValue;

  return {
    getItem: () => value,
    setItem: (_key: string, nextValue: string) => {
      value = nextValue;
    },
    removeItem: () => {
      value = null;
    },
  };
}

function resetOnboardingState() {
  useFactoryStore.setState({
    user: { ...factoryUser },
    customCompanyName: null,
    currentCompany: Array.from(companyNameMap.keys())[0] ?? "acme-corp",
  });
}

describe("factory onboarding", () => {
  afterEach(() => {
    resetOnboardingState();
  });

  it("treats absent, blank, and malformed storage as a new user", () => {
    expect(readFactoryCustomCompany(createStorage())).toBeNull();
    expect(
      readFactoryCustomCompany(createStorage(JSON.stringify({ name: "   " }))),
    ).toBeNull();
    expect(readFactoryCustomCompany(createStorage("not-json"))).toBeNull();
  });

  it("guards factory routes until onboarding is complete", () => {
    expect(isFactoryOnboardingComplete(null)).toBe(false);
    expect(isFactoryOnboardingComplete("   ")).toBe(false);
    expect(isFactoryOnboardingComplete("Northstar Works")).toBe(true);
  });

  it("calculates bounded loading progress through completion", () => {
    expect(getFactoryLoadingProgress(0)).toBe(0);
    expect(getFactoryLoadingProgress(FACTORY_LOADING_TOTAL_TICKS * 0.1)).toBe(
      18,
    );
    expect(getFactoryLoadingProgress(FACTORY_LOADING_TOTAL_TICKS / 2)).toBe(61);
    expect(getFactoryLoadingProgress(FACTORY_LOADING_TOTAL_TICKS * 0.85)).toBe(
      88,
    );
    expect(getFactoryLoadingProgress(FACTORY_LOADING_TOTAL_TICKS)).toBe(100);
    expect(getFactoryLoadingProgress(FACTORY_LOADING_TOTAL_TICKS + 10)).toBe(
      100,
    );
  });

  it("trims and restores a persisted custom company", () => {
    const storage = createStorage();

    expect(writeFactoryCustomCompany("  Northstar Works  ", storage)).toBe(
      "Northstar Works",
    );
    expect(readFactoryCustomCompany(storage)).toBe("Northstar Works");
  });

  it("uses a factory-specific persistence key", () => {
    let savedKey = "";
    const storage = {
      setItem: (key: string) => {
        savedKey = key;
      },
    };

    writeFactoryCustomCompany("Northstar Works", storage);

    expect(savedKey).toBe(FACTORY_CUSTOM_COMPANY_STORAGE_KEY);
  });

  it("removes the persisted company when an account is deleted", () => {
    const storage = createStorage(
      JSON.stringify({ name: "Northstar Works" }),
    );

    expect(removeFactoryCustomCompany(storage)).toBe(true);
    expect(readFactoryCustomCompany(storage)).toBeNull();
  });

  it("prefills names and validates every required field", () => {
    expect(splitFactoryWelcomeName("Avery Morgan")).toEqual({
      firstName: "Avery",
      lastName: "Morgan",
    });
    expect(
      validateFactoryWelcomeValues({
        firstName: " ",
        lastName: " ",
        companyName: " ",
      }),
    ).toEqual({
      firstName: "required",
      lastName: "required",
      companyName: "required",
    });
  });

  it("normalizes submitted values", () => {
    expect(
      normalizeFactoryWelcomeValues({
        firstName: " Avery ",
        lastName: " Stone ",
        companyName: " Northstar Works ",
      }),
    ).toEqual({
      firstName: "Avery",
      lastName: "Stone",
      companyName: "Northstar Works",
    });
  });

  it("selects a custom company and applies the edited user name", () => {
    const store = useFactoryStore.getState();

    store.updateUserProfile({ name: "Avery Stone" });
    store.setCustomCompany("Northstar Works");

    expect(useFactoryStore.getState()).toMatchObject({
      currentCompany: FACTORY_CUSTOM_COMPANY_ID,
      customCompanyName: "Northstar Works",
      user: { name: "Avery Stone" },
    });
  });

  it("clears the custom company from the store for a new-user redirect", () => {
    const store = useFactoryStore.getState();

    store.setCustomCompany("Northstar Works");
    useFactoryStore.getState().clearCustomCompany();

    expect(useFactoryStore.getState()).toMatchObject({
      customCompanyName: null,
      currentCompany: "acme-corp",
    });
  });
});
