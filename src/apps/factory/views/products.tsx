import { useTranslation } from "react-i18next";

export function ProductsView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.products.title")}</h2>
    </section>
  );
}
