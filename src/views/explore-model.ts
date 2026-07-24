import {
  blackDiscItems as mockBlackDiscItems,
  mockItems,
} from "@/views/explore/mock";

export const exploreFontVariants = [
  "plex",
  "nunito",
  "serif",
  "mono",
  "system",
] as const;

export type ExploreFontVariant = (typeof exploreFontVariants)[number];

export type ExploreItem = {
  slug: string;
  title: string;
  subtitle: string;
  href?: string;
  coverImage: string;
  backgroundColor: string;
  foregroundColor: string;
  spineLabelColor: string;
  fontVariant: ExploreFontVariant;
  caseThicknessPx: number;
  restingTiltDeg: number;
};

export type BlackDiscItem = {
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
};

export type BlackDiscActivationSource = "mouse" | "keyboard" | "touch";

export type BlackDiscInteractionState = {
  activeSlug: string | null;
  activationSource: BlackDiscActivationSource | null;
};

export type BlackDiscTilt = {
  rotateXDeg: number;
  rotateYDeg: number;
  lightXPercent: number;
  lightYPercent: number;
};

export type BlackDiscBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ExploreActivationSource = "mouse" | "keyboard" | "touch";

export type ExploreInteractionState = {
  activeSlug: string | null;
  touchArmedSlug: string | null;
  activationSource: ExploreActivationSource | null;
};

export type TouchActivationResult = {
  state: ExploreInteractionState;
  shouldNavigate: boolean;
};

export const initialExploreInteractionState: ExploreInteractionState = {
  activeSlug: null,
  touchArmedSlug: null,
  activationSource: null,
};

export const exploreItems = mockItems as ExploreItem[];
export const blackDiscItems = mockBlackDiscItems as BlackDiscItem[];

export const initialBlackDiscInteractionState: BlackDiscInteractionState = {
  activeSlug: null,
  activationSource: null,
};

export function activateBlackDisc(
  slug: string,
  activationSource: Exclude<BlackDiscActivationSource, "touch">,
): BlackDiscInteractionState {
  return {
    activeSlug: slug,
    activationSource,
  };
}

export function deactivateBlackDisc(
  state: BlackDiscInteractionState,
  slug: string,
  activationSource: Exclude<BlackDiscActivationSource, "touch">,
): BlackDiscInteractionState {
  if (
    state.activeSlug !== slug ||
    state.activationSource !== activationSource
  ) {
    return state;
  }

  return initialBlackDiscInteractionState;
}

export function toggleBlackDiscByTouch(
  state: BlackDiscInteractionState,
  slug: string,
): BlackDiscInteractionState {
  if (state.activeSlug === slug && state.activationSource === "touch") {
    return initialBlackDiscInteractionState;
  }

  return {
    activeSlug: slug,
    activationSource: "touch",
  };
}

export function calculateBlackDiscTilt(
  clientX: number,
  clientY: number,
  bounds: BlackDiscBounds,
  maxTiltDeg = 5,
): BlackDiscTilt {
  const width = Math.max(bounds.width, 1);
  const height = Math.max(bounds.height, 1);
  const x = Math.min(Math.max((clientX - bounds.left) / width, 0), 1);
  const y = Math.min(Math.max((clientY - bounds.top) / height, 0), 1);

  return {
    rotateXDeg: (0.5 - y) * maxTiltDeg * 2,
    rotateYDeg: (x - 0.5) * maxTiltDeg * 2,
    lightXPercent: x * 100,
    lightYPercent: y * 100,
  };
}

export function activateExploreItem(
  slug: string,
  activationSource: Exclude<ExploreActivationSource, "touch">,
): ExploreInteractionState {
  return {
    activeSlug: slug,
    touchArmedSlug: null,
    activationSource,
  };
}

export function hoverExploreItem(slug: string): ExploreInteractionState {
  return activateExploreItem(slug, "mouse");
}

export function focusExploreItem(slug: string): ExploreInteractionState {
  return activateExploreItem(slug, "keyboard");
}

export function leaveExploreItem(
  state: ExploreInteractionState,
  slug: string,
): ExploreInteractionState {
  if (state.activeSlug !== slug || state.activationSource !== "mouse") {
    return state;
  }

  return resetExploreInteraction();
}

export function blurExploreItem(
  state: ExploreInteractionState,
  slug: string,
): ExploreInteractionState {
  if (state.activeSlug !== slug || state.activationSource !== "keyboard") {
    return state;
  }

  return resetExploreInteraction();
}

export function activateExploreItemByTouch(
  state: ExploreInteractionState,
  slug: string,
  hasDestination: boolean,
): TouchActivationResult {
  const isArmed = state.activeSlug === slug && state.touchArmedSlug === slug;

  return {
    state: {
      activeSlug: slug,
      touchArmedSlug: slug,
      activationSource: "touch",
    },
    shouldNavigate: isArmed && hasDestination,
  };
}

export function resetExploreInteraction(): ExploreInteractionState {
  return initialExploreInteractionState;
}
