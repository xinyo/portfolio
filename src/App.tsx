import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/logo.webp";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} alt="Hero" className="logo" />
        </div>
        <div>
          <h1>{t("get_started")}</h1>
          <p>
            <Trans i18nKey="intro">
              Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
            </Trans>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          {t("count_is", { count })}
        </button>
      </section>

      <div className="ticks"></div>
    </>
  );
}

export default App;
