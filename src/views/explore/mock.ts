import apertureSvg from "@/assets/covers/aperture.svg";
import atlasSvg from "@/assets/covers/atlas.svg";
import continuumSvg from "@/assets/covers/continuum.svg";
import factorySvg from "@/assets/covers/factory.svg";
import fieldNotesSvg from "@/assets/covers/field-notes.svg";
import ledgerSvg from "@/assets/covers/ledger.svg";
import lowFidelitySvg from "@/assets/covers/low-fidelity.svg";
import mosaicSvg from "@/assets/covers/mosaic.svg";
import nightSignalSvg from "@/assets/covers/night-signal.svg";
import redThreadSvg from "@/assets/covers/red-thread.svg";
import relaySvg from "@/assets/covers/relay.svg";
import signalSvg from "@/assets/covers/signal.svg";
import tempoSvg from "@/assets/covers/tempo.svg";

const coverImages: Record<string, string> = {
  aperture: apertureSvg,
  atlas: atlasSvg,
  continuum: continuumSvg,
  factory: factorySvg,
  "field-notes": fieldNotesSvg,
  ledger: ledgerSvg,
  mosaic: mosaicSvg,
  relay: relaySvg,
  signal: signalSvg,
  tempo: tempoSvg,
};

export const mockItems = [
  {
    slug: "night-signal",
    title: "Night Signal",
    subtitle: "Interfaces for the hours between systems.",
    coverImage: nightSignalSvg,
    backgroundColor: "#a9b7a7",
    foregroundColor: "#17211a",
    spineLabelColor: "#17211a",
    fontVariant: "plex",
    caseThicknessPx: 44,
    restingTiltDeg: 0,
  },
  {
    slug: "atlas",
    title: "Atlas",
    subtitle: "A calm way to map complex products and the people behind them.",
    coverImage: coverImages.atlas,
    backgroundColor: "#aeb8c1",
    foregroundColor: "#17212a",
    spineLabelColor: "#17212a",
    fontVariant: "serif",
    caseThicknessPx: 46,
    restingTiltDeg: 0,
  },
  {
    slug: "aperture",
    title: "Aperture",
    subtitle:
      "An editorial image study built around focus, sequence, and light.",
    coverImage: coverImages.aperture,
    backgroundColor: "#c0a9a2",
    foregroundColor: "#291a18",
    spineLabelColor: "#291a18",
    fontVariant: "nunito",
    caseThicknessPx: 42,
    restingTiltDeg: 0,
  },
  {
    slug: "continuum",
    title: "Continuum",
    subtitle: "A visual language for long-running work and changing systems.",
    coverImage: coverImages.continuum,
    backgroundColor: "#b9a9b8",
    foregroundColor: "#251b25",
    spineLabelColor: "#251b25",
    fontVariant: "mono",
    caseThicknessPx: 48,
    restingTiltDeg: 0,
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    subtitle: "Small observations about interfaces, teams, and everyday tools.",
    coverImage: coverImages["field-notes"],
    backgroundColor: "#c5b5a7",
    foregroundColor: "#2a2019",
    spineLabelColor: "#2a2019",
    fontVariant: "system",
    caseThicknessPx: 44,
    restingTiltDeg: 0,
  },
  {
    slug: "ledger",
    title: "Ledger",
    subtitle: "Making dense operational information feel direct and legible.",
    coverImage: coverImages.ledger,
    backgroundColor: "#b9b59f",
    foregroundColor: "#252317",
    spineLabelColor: "#252317",
    fontVariant: "plex",
    caseThicknessPx: 40,
    restingTiltDeg: 0,
  },
  {
    slug: "mosaic",
    title: "Mosaic",
    subtitle: "A modular workspace assembled from expressive, reusable parts.",
    coverImage: coverImages.mosaic,
    backgroundColor: "#a7b8b6",
    foregroundColor: "#172523",
    spineLabelColor: "#172523",
    fontVariant: "serif",
    caseThicknessPx: 46,
    restingTiltDeg: 0,
  },
  {
    slug: "relay",
    title: "Relay",
    subtitle:
      "A lightweight handoff system for teams moving at different speeds.",
    coverImage: coverImages.relay,
    backgroundColor: "#b6a9a0",
    foregroundColor: "#271e1a",
    spineLabelColor: "#271e1a",
    fontVariant: "mono",
    caseThicknessPx: 42,
    restingTiltDeg: 0,
  },
  {
    slug: "signal",
    title: "Signal",
    subtitle: "Turning noisy activity into a few useful, timely decisions.",
    coverImage: coverImages.signal,
    backgroundColor: "#aab1c2",
    foregroundColor: "#181e2b",
    spineLabelColor: "#181e2b",
    fontVariant: "nunito",
    caseThicknessPx: 45,
    restingTiltDeg: 1.2,
  },
  {
    slug: "tempo",
    title: "Tempo",
    subtitle: "A scheduling concept shaped around rhythm instead of urgency.",
    coverImage: coverImages.tempo,
    backgroundColor: "#c7b8a5",
    foregroundColor: "#261f19",
    spineLabelColor: "#261f19",
    fontVariant: "system",
    caseThicknessPx: 40,
    restingTiltDeg: -3.4,
  },
];

export const blackDiscItems = [
  {
    slug: "factory",
    title: "Factory.app",
    subtitle:
      "A connected workspace for orders, production, scheduling, and time.",
    href: "/apps/factory",
    coverImage: coverImages.factory,
  },
  {
    slug: "red-thread",
    title: "Red Thread",
    subtitle: "A study in continuity, rhythm, and restraint.",
    coverImage: redThreadSvg,
  },
  {
    slug: "low-fidelity",
    title: "Low Fidelity",
    subtitle: "Rough ideas shaped into useful, tactile tools.",
    coverImage: lowFidelitySvg,
  },
];
