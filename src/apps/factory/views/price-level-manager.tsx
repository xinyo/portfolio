import devImage from "@/assets/dev.webp";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function PriceLevelManagerView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.priceLevelManager.title")}</h2>
      <div className="flex flex-col items-center gap-8 mt-8 text-center">
        <div className="factory-view__dev-image">
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
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold">
            {t("factory.views.priceLevelManager.introducing")}
          </h3>
          <p className="text-muted-foreground max-w-lg">
            {t("factory.views.priceLevelManager.description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default">
            {t("factory.views.priceLevelManager.startWithTemplate")}
          </Button>
          <Button variant="outline">
            {t("factory.views.priceLevelManager.createMyPriceLevel")}
          </Button>
        </div>
      </div>
    </section>
  );
}
