import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import factoryLogo from "@/apps/factory/assets/logo.png";
import {
  FACTORY_LOADING_DURATION_MS,
  FACTORY_LOADING_TICK_MS,
  FACTORY_LOADING_TOTAL_TICKS,
  getFactoryLoadingProgress,
  normalizeFactoryWelcomeValues,
  splitFactoryWelcomeName,
  validateFactoryWelcomeValues,
  writeFactoryCustomCompany,
  type FactoryWelcomeErrors,
} from "@/apps/factory/onboarding";
import { useFactoryStore } from "@/apps/factory/store";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export function WelcomeView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userName = useFactoryStore((state) => state.user.name);
  const updateUserProfile = useFactoryStore((state) => state.updateUserProfile);
  const setCustomCompany = useFactoryStore((state) => state.setCustomCompany);
  const initialName = splitFactoryWelcomeName(userName);
  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [companyName, setCompanyName] = useState("");
  const [errors, setErrors] = useState<FactoryWelcomeErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTick, setLoadingTick] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const progressInterval = window.setInterval(() => {
      setLoadingTick((tick) => Math.min(tick + 1, FACTORY_LOADING_TOTAL_TICKS));
    }, FACTORY_LOADING_TICK_MS);
    const navigationTimeout = window.setTimeout(() => {
      setLoadingTick(FACTORY_LOADING_TOTAL_TICKS);
      navigate("/apps/factory", { replace: true });
    }, FACTORY_LOADING_DURATION_MS);

    return () => {
      window.clearInterval(progressInterval);
      window.clearTimeout(navigationTimeout);
    };
  }, [isLoading, navigate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    const values = { firstName, lastName, companyName };
    const nextErrors = validateFactoryWelcomeValues(values);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const normalized = normalizeFactoryWelcomeValues(values);
    const savedCompany = writeFactoryCustomCompany(normalized.companyName);

    if (!savedCompany) {
      setErrors({ companyName: "required" });
      return;
    }

    updateUserProfile({
      name: `${normalized.firstName} ${normalized.lastName}`,
    });
    setCustomCompany(savedCompany);
    setLoadingTick(0);
    setIsLoading(true);
  }

  const requiredMessage = t("factory.welcome.validation.required");
  const loadingProgress = getFactoryLoadingProgress(loadingTick);

  if (isLoading) {
    return (
      <main className="factory-app-page factory-welcome-loading-page">
        <div
          className="factory-welcome-loading"
          role="status"
          aria-live="polite"
        >
          <img src={factoryLogo} alt={t("factory.welcome.loading.logoAlt")} />
          <Progress
            value={loadingProgress}
            aria-label={t("factory.welcome.loading.progressLabel")}
            className="factory-welcome-progress"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="factory-app-page factory-welcome-page">
      <section className="factory-welcome-form-panel">
        <form
          className="factory-welcome-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="factory-welcome-heading">
            <div className="factory-welcome-eyebrow-row">
              <img src={factoryLogo} alt="Factory Logo" />
              <p>{t("factory.welcome.eyebrow")}</p>
            </div>
            <h1>{t("factory.welcome.title")}</h1>
            {/* <span>{t("factory.welcome.description")}</span> */}
          </div>

          <FieldGroup className="text-left">
            <Field>
              <FieldLabel htmlFor="factory-welcome-first-name">
                {t("factory.welcome.firstName")}
              </FieldLabel>
              <Input
                id="factory-welcome-first-name"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                required
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={
                  errors.firstName ? "first-name-error" : undefined
                }
                onChange={(event) => setFirstName(event.target.value)}
              />
              {errors.firstName && (
                <FieldError id="first-name-error" role="alert">
                  {requiredMessage}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="factory-welcome-last-name">
                {t("factory.welcome.lastName")}
              </FieldLabel>
              <Input
                id="factory-welcome-last-name"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                required
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={
                  errors.lastName ? "last-name-error" : undefined
                }
                onChange={(event) => setLastName(event.target.value)}
              />
              {errors.lastName && (
                <FieldError id="last-name-error" role="alert">
                  {requiredMessage}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="factory-welcome-company-name">
                {t("factory.welcome.companyName")}
              </FieldLabel>
              <Input
                id="factory-welcome-company-name"
                name="companyName"
                autoComplete="organization"
                value={companyName}
                required
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={
                  errors.companyName ? "company-name-error" : undefined
                }
                onChange={(event) => setCompanyName(event.target.value)}
              />
              {errors.companyName && (
                <FieldError id="company-name-error" role="alert">
                  {requiredMessage}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            size="lg"
            className="factory-welcome-submit"
            disabled={isLoading}
          >
            {t("factory.welcome.submit")}
          </Button>
        </form>
      </section>

      <aside className="factory-welcome-art" aria-hidden="true"></aside>
    </main>
  );
}
