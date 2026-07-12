export const FACTORY_CUSTOM_COMPANY_ID = "custom-company";
export const FACTORY_CUSTOM_COMPANY_STORAGE_KEY = "factory.customCompany";
export const FACTORY_LOADING_DURATION_MS = 3000;
export const FACTORY_LOADING_TICK_MS = 30;
export const FACTORY_LOADING_TOTAL_TICKS =
  FACTORY_LOADING_DURATION_MS / FACTORY_LOADING_TICK_MS;

const FACTORY_LOADING_KEYFRAMES = [
  [0, 0],
  [10, 18],
  [25, 42],
  [45, 55],
  [65, 78],
  [85, 88],
  [95, 97],
  [100, 100],
] as const;

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem">;
type StorageRemover = Pick<Storage, "removeItem">;

type StoredFactoryCompany = {
  name: string;
};

export type FactoryWelcomeValues = {
  firstName: string;
  lastName: string;
  companyName: string;
};

export type FactoryWelcomeErrors = Partial<
  Record<keyof FactoryWelcomeValues, "required">
>;

export function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readFactoryCustomCompany(
  storage: StorageReader | null = getBrowserStorage(),
): string | null {
  if (!storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(FACTORY_CUSTOM_COMPANY_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const storedCompany = JSON.parse(rawValue) as Partial<StoredFactoryCompany>;
    const name =
      typeof storedCompany.name === "string" ? storedCompany.name.trim() : "";

    return name || null;
  } catch {
    return null;
  }
}

export function writeFactoryCustomCompany(
  name: string,
  storage: StorageWriter | null = getBrowserStorage(),
): string | null {
  const trimmedName = name.trim();

  if (!trimmedName || !storage) {
    return null;
  }

  try {
    storage.setItem(
      FACTORY_CUSTOM_COMPANY_STORAGE_KEY,
      JSON.stringify({ name: trimmedName } satisfies StoredFactoryCompany),
    );
    return trimmedName;
  } catch {
    return null;
  }
}

export function removeFactoryCustomCompany(
  storage: StorageRemover | null = getBrowserStorage(),
): boolean {
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(FACTORY_CUSTOM_COMPANY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function splitFactoryWelcomeName(name: string) {
  const [firstName = "", ...lastNameParts] = name.trim().split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
}

export function validateFactoryWelcomeValues(
  values: FactoryWelcomeValues,
): FactoryWelcomeErrors {
  const errors: FactoryWelcomeErrors = {};

  for (const key of ["firstName", "lastName", "companyName"] as const) {
    if (!values[key].trim()) {
      errors[key] = "required";
    }
  }

  return errors;
}

export function normalizeFactoryWelcomeValues(values: FactoryWelcomeValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    companyName: values.companyName.trim(),
  };
}

export function isFactoryOnboardingComplete(
  customCompanyName: string | null,
): boolean {
  return Boolean(customCompanyName?.trim());
}

export function getFactoryLoadingProgress(tick: number): number {
  const boundedTick = Math.min(Math.max(tick, 0), FACTORY_LOADING_TOTAL_TICKS);

  const elapsedPercent = (boundedTick / FACTORY_LOADING_TOTAL_TICKS) * 100;

  for (let index = 1; index < FACTORY_LOADING_KEYFRAMES.length; index += 1) {
    const previous = FACTORY_LOADING_KEYFRAMES[index - 1];
    const next = FACTORY_LOADING_KEYFRAMES[index];

    if (!previous || !next || elapsedPercent > next[0]) {
      continue;
    }

    const segmentProgress =
      (elapsedPercent - previous[0]) / (next[0] - previous[0]);

    return Math.round(previous[1] + segmentProgress * (next[1] - previous[1]));
  }

  return 100;
}
