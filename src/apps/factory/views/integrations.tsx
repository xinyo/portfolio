import { useTranslation } from "react-i18next";

export function IntegrationsView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.integrations.title")}</h2>
    </section>
  );
}
