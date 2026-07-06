import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import designGrid from "@/assets/design-grid.webp";
import deputyLogo from "@/assets/Deputy-Logo.svg";
import { Button } from "@/components/ui/button";

type GalleryBackground =
  | { type: "image"; src: string }
  | { type: "color"; color: string; logo: string };

interface GalleryCard {
  title: string;
  subtitle: string;
  background: GalleryBackground;
  url: string;
}

const galleryItems = new Map<string, GalleryCard>([
  [
    "factory",
    {
      title: "Factory.app",
      subtitle:
        "Online tools for fabricators to create orders, collaborate on work, schedule jobs and track time from one location.",
      background: { type: "image", src: designGrid },
      url: "/apps/factory",
    },
  ],
  [
    "deputy",
    {
      title: "Deputy.com",
      subtitle:
        "From first hire to final pay, Deputy makes the hard parts of shift work simple with truly actionable AI, helping you improve profitability and simplify compliance.",
      background: { type: "color", color: "#FFFFFF", logo: deputyLogo },
      url: "https://once.deputy.com",
    },
  ],
]);

function isExternal(url: string) {
  return /^https?:\/\//.test(url);
}

export function Explore() {
  const { t } = useTranslation();

  return (
    <main className="explore-page">
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

      <section className="subapp-gallery" aria-label={t("explore.kicker")}>
        {Array.from(galleryItems.entries()).map(([slug, item]) => {
          const external = isExternal(item.url);

          const background =
            item.background.type === "image" ? (
              <img
                className="subapp-card-bg"
                src={item.background.src}
                alt=""
                aria-hidden="true"
              />
            ) : (
              <div
                className="subapp-card-bg"
                style={{ background: item.background.color }}
              >
                <img
                  src={item.background.logo}
                  alt={item.title}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: "60%",
                    maxHeight: "40%",
                    objectFit: "contain",
                  }}
                />
              </div>
            );

          const info = (
            <div className="subapp-info">
              <h2>{item.title}</h2>
              <p>{item.subtitle}</p>
              <span className="subapp-card-action" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </div>
          );

          if (external) {
            return (
              <a
                key={slug}
                className="subapp-card"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {background}
                {info}
              </a>
            );
          }

          return (
            <Link
              key={slug}
              className="subapp-card"
              to={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {background}
              {info}
            </Link>
          );
        })}
      </section>
    </main>
  );
}
