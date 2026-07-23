import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import designGrid from "@/assets/design-grid.webp";
import { Button } from "@/components/ui/button";

type GalleryItem = {
  slug: string;
  title: string;
  subtitle: string;
};

const appRoutes: Record<string, string> = {
  factory: "/apps/factory",
  jellyocto: "/apps/jellyocto",
};

export function Explore() {
  const { t } = useTranslation();
  const gallery = t("explore.gallery", {
    returnObjects: true,
  }) as GalleryItem[];

  return (
    <main className="explore-page" transition-style="in:wipe:right">
      <div className="explore-header">
        <div className="view-copy">
          <p className="view-kicker">{t("explore.kicker")}</p>
          <h1 className="text-4xl">{t("explore.title")}</h1>
          <p>{t("explore.description")}</p>
        </div>

        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft />
            {t("explore.home")}
          </Link>
        </Button>
      </div>

      <section className="subapp-gallery flex" aria-label={t("explore.kicker")}>
        {gallery.map((item) => (
          <Link
            className="subapp-card"
            key={item.slug}
            to={appRoutes[item.slug] ?? "/explore"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="subapp-card-bg"
              src={designGrid}
              alt=""
              aria-hidden="true"
            />
            <div className="subapp-info">
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
              <span className="subapp-card-action" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
