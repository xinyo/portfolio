import { FactoryApp } from "@/apps/factory";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { About } from "@/views/about";
import { Explore } from "@/views/explore";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { BrowserRouter, Link, Route, Routes } from "react-router";

import "./App.css";
import heroImgAttack from "./assets/logo-attack.webp";
import heroImg from "./assets/logo.webp";

// type PrincipleItem = {
//   title: string;
//   body: string;
// };

function HomePage() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  // const principles = t("operating_principles.items", {
  //   returnObjects: true,
  // }) as PrincipleItem[];
  const { isDark, setIsDark } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div className="profolio-home flex flex-col items-center justify-center gap-8">
        <section id="center">
          <div className="hero">
            <img
              src={hovered ? heroImgAttack : heroImg}
              alt="Hero"
              className="logo"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            />
          </div>
          <div className="hero-title">
            <h1>{t("get_started")}</h1>
            <p>
              <Trans i18nKey="intro"></Trans>
            </p>
          </div>

          <div className="button-group">
            <Button
              asChild
              size="lg"
              onClick={() => setCount((count) => count + 1)}
            >
              <Link to="/about">
                {t("hero_primary_btn", { count })}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/explore">
                {t("hero_secondary_btn")}
                <ChevronRight />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsDark((d) => !d)}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? "\u2600" : "\u2601"}
            </Button>
          </div>
        </section>

        {/* <section
        className="principles-section"
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
      </section> */}
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
        <Route path="/apps/factory/*" element={<FactoryApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
