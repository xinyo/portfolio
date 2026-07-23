import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";
import { About } from "@/views/about";
import { Explore } from "@/views/explore";
import { ArrowRight, ChevronRight, Moon, Sun } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Link, Route, Routes } from "react-router";

const FactoryApp = lazy(() =>
  import("@/apps/factory").then((m) => ({ default: m.FactoryApp })),
);

const JellyoctoApp = lazy(() =>
  import("@/apps/jellyocto").then((m) => ({ default: m.JellyoctoApp })),
);

import "./App.css";
import heroImgAttack from "./assets/logo-attack.webp";
import heroImg from "./assets/logo.webp";

type PrincipleItem = {
  title: string;
  body: string;
};

function HomePage() {
  const { t } = useTranslation();
  const principles = t("operating_principles.items", {
    returnObjects: true,
  }) as PrincipleItem[];
  const { isDark, setIsDark } = useTheme();
  const [hovered, setHovered] = useState(false);
  const titleAnimationFrame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (titleAnimationFrame.current !== null) {
        cancelAnimationFrame(titleAnimationFrame.current);
      }
    },
    [],
  );

  function updateTitleTilt(event: React.PointerEvent<HTMLHeadingElement>) {
    if (event.pointerType === "touch") return;

    const title = event.currentTarget;
    const { clientX, clientY } = event;

    if (titleAnimationFrame.current !== null) {
      cancelAnimationFrame(titleAnimationFrame.current);
    }

    titleAnimationFrame.current = requestAnimationFrame(() => {
      const bounds = title.getBoundingClientRect();
      const x = Math.min(
        Math.max((clientX - bounds.left) / bounds.width, 0),
        1,
      );
      const y = Math.min(
        Math.max((clientY - bounds.top) / bounds.height, 0),
        1,
      );

      title.style.setProperty("--title-rotate-x", `${(0.5 - y) * 8}deg`);
      title.style.setProperty("--title-rotate-y", `${(x - 0.5) * 8}deg`);
      title.style.setProperty("--title-light-x", `${x * 100}%`);
      title.style.setProperty("--title-light-y", `${y * 100}%`);
      title.dataset.tilted = "true";
      titleAnimationFrame.current = null;
    });
  }

  function resetTitleTilt(event: React.PointerEvent<HTMLHeadingElement>) {
    const title = event.currentTarget;

    if (titleAnimationFrame.current !== null) {
      cancelAnimationFrame(titleAnimationFrame.current);
    }

    titleAnimationFrame.current = requestAnimationFrame(() => {
      title.style.setProperty("--title-rotate-x", "0deg");
      title.style.setProperty("--title-rotate-y", "0deg");
      title.style.setProperty("--title-light-x", "50%");
      title.style.setProperty("--title-light-y", "50%");
      delete title.dataset.tilted;
      titleAnimationFrame.current = null;
    });
  }

  return (
    <>
      <div
        className="portfolio-home flex flex-col items-center justify-center gap-8"
        transition-style="in:wipe:left"
      >
        <header className="home-header">
          <div className="hero">
            <img
              src={hovered ? heroImgAttack : heroImg}
              alt="Hero"
              className="logo"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsDark((d) => !d)}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </header>
        <section id="center">
          <div className="hero-title">
            <h1
              className="hero-title-tilt text-5xl"
              onPointerMove={updateTitleTilt}
              onPointerLeave={resetTitleTilt}
              onPointerCancel={resetTitleTilt}
            >
              {t("get_started")}
            </h1>
            {/* <p>
              <Trans i18nKey="intro"></Trans>
            </p> */}
          </div>

          <div className="button-group">
            <Button asChild size="lg">
              <Link to="/about">
                {t("hero_primary_btn")}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/explore">
                {t("hero_secondary_btn")}
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </section>

        <section
          className="hidden"
          origin-class-data="principles-section"
          aria-labelledby="principles-title"
        >
          <div className="principles-heading">
            <p className="section-kicker">{t("operating_principles.title")}</p>
            <h2 id="principles-title">{t("operating_principles.headline")}</h2>
          </div>
          <div className="principles-list">
            {principles.map((principle) => (
              <article className="principle" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/apps/factory/*"
          element={
            <Suspense fallback={null}>
              <FactoryApp />
            </Suspense>
          }
        />
        <Route
          path="/apps/jellyocto/*"
          element={
            <Suspense fallback={null}>
              <JellyoctoApp />
            </Suspense>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
