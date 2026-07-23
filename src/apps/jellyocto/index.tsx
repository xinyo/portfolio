import { useEffect } from "react";
import { Route, Routes } from "react-router";

import { usePageTitle } from "@/hooks/use-page-title";
import { JellyoctoHome } from "./views/home";

export function JellyoctoApp() {
  usePageTitle("Jellyocto");

  useEffect(() => {
    document.body.classList.add("jellyocto-app");
    return () => document.body.classList.remove("jellyocto-app");
  }, []);

  return (
    <Routes>
      <Route path="*" element={<JellyoctoHome />} />
    </Routes>
  );
}
