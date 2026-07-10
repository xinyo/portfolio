import devImage from "@/assets/dev.webp";
import { useTranslation } from "react-i18next";

export function PriceLevelManagerView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.priceLevelManager.title")}</h2>
      <div className="flex flex-col items-center">
        <div className="factory-view__dev-image mt-8">
          <img
            src={devImage}
            alt=""
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </section>
  );
}
