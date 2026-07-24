import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import "@/i18n";
import { Explore } from "@/views/explore";
import {
  activateBlackDisc,
  activateExploreItem,
  activateExploreItemByTouch,
  blackDiscItems,
  blurExploreItem,
  calculateBlackDiscTilt,
  deactivateBlackDisc,
  exploreFontVariants,
  exploreItems,
  focusExploreItem,
  hoverExploreItem,
  initialBlackDiscInteractionState,
  initialExploreInteractionState,
  leaveExploreItem,
  resetExploreInteraction,
  toggleBlackDiscByTouch,
} from "@/views/explore-model";

const hexColor = /^#[0-9a-f]{6}$/i;

function relativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

  if (!channels || channels.length !== 3) return 0;

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

describe("Explore collection data", () => {
  it("provides at least ten unique, locally illustrated work items", () => {
    expect(exploreItems.length).toBeGreaterThanOrEqual(10);
    expect(new Set(exploreItems.map(({ slug }) => slug)).size).toBe(
      exploreItems.length,
    );

    for (const item of exploreItems) {
      expect(item.title.trim()).not.toBe("");
      expect(item.subtitle.trim()).not.toBe("");
      expect(item.coverImage).toMatch(/^data:image\/svg\+xml/);
      expect(item.backgroundColor).toMatch(hexColor);
      expect(item.foregroundColor).toMatch(hexColor);
      expect(item.spineLabelColor).toMatch(hexColor);
      expect(
        contrastRatio(item.backgroundColor, item.foregroundColor),
      ).toBeGreaterThanOrEqual(4.5);
      expect(exploreFontVariants).toContain(item.fontVariant);
      expect(item.caseThicknessPx).toBeGreaterThanOrEqual(40);
      expect(item.caseThicknessPx).toBeLessThanOrEqual(48);
      expect(item.restingTiltDeg).toBeGreaterThanOrEqual(-3.5);
      expect(item.restingTiltDeg).toBeLessThanOrEqual(3.5);
    }
  });

  it("varies case thickness and resting lean across the rack", () => {
    const thicknesses = new Set(
      exploreItems.map(({ caseThicknessPx }) => caseThicknessPx),
    );
    const tilts = exploreItems.map(({ restingTiltDeg }) => restingTiltDeg);

    expect(thicknesses.size).toBeGreaterThanOrEqual(3);
    expect(tilts.some((tilt) => tilt < 0)).toBe(true);
    expect(tilts.some((tilt) => tilt > 0)).toBe(true);
  });

  it("only exposes Factory as a navigable project", () => {
    const linkedItems = exploreItems.filter(({ href }) => href);

    expect(linkedItems).toEqual([
      expect.objectContaining({
        slug: "factory",
        href: "/apps/factory",
      }),
    ]);
  });
});

describe("Explore vinyl collection data", () => {
  it("provides exactly three unique, locally illustrated vinyl items", () => {
    expect(blackDiscItems).toHaveLength(3);
    expect(new Set(blackDiscItems.map(({ slug }) => slug)).size).toBe(3);
    expect(blackDiscItems.map(({ title }) => title)).toEqual([
      "Night Signal",
      "Red Thread",
      "Low Fidelity",
    ]);

    for (const item of blackDiscItems) {
      expect(item.title.trim()).not.toBe("");
      expect(item.subtitle.trim()).not.toBe("");
      expect(item.coverImage).toMatch(/^data:image\/svg\+xml/);
    }
  });
});

describe("Explore collection interaction model", () => {
  it("tracks mouse and keyboard activation sources independently", () => {
    expect(hoverExploreItem("atlas")).toEqual({
      activeSlug: "atlas",
      touchArmedSlug: null,
      activationSource: "mouse",
    });
    expect(focusExploreItem("atlas")).toEqual({
      activeSlug: "atlas",
      touchArmedSlug: null,
      activationSource: "keyboard",
    });
    expect(activateExploreItem("atlas", "mouse")).toEqual(
      hoverExploreItem("atlas"),
    );
  });

  it("closes mouse activation on leave but preserves keyboard activation", () => {
    const hovered = hoverExploreItem("atlas");
    const focused = focusExploreItem("atlas");

    expect(leaveExploreItem(hovered, "atlas")).toEqual(
      initialExploreInteractionState,
    );
    expect(leaveExploreItem(focused, "atlas")).toBe(focused);
    expect(blurExploreItem(focused, "atlas")).toEqual(
      initialExploreInteractionState,
    );
    expect(blurExploreItem(hovered, "atlas")).toBe(hovered);
  });

  it("can switch hovered items while the previous case is transitioning", () => {
    const first = hoverExploreItem("atlas");
    const second = hoverExploreItem("signal");

    expect(first.activeSlug).toBe("atlas");
    expect(second).toEqual({
      activeSlug: "signal",
      touchArmedSlug: null,
      activationSource: "mouse",
    });
  });

  it("requires two touches before allowing a linked item to navigate", () => {
    const firstTouch = activateExploreItemByTouch(
      initialExploreInteractionState,
      "factory",
      true,
    );
    const secondTouch = activateExploreItemByTouch(
      firstTouch.state,
      "factory",
      true,
    );

    expect(firstTouch.shouldNavigate).toBe(false);
    expect(firstTouch.state).toEqual({
      activeSlug: "factory",
      touchArmedSlug: "factory",
      activationSource: "touch",
    });
    expect(secondTouch.shouldNavigate).toBe(true);
  });

  it("never navigates preview-only items and resets all active state", () => {
    const firstTouch = activateExploreItemByTouch(
      initialExploreInteractionState,
      "atlas",
      false,
    );
    const secondTouch = activateExploreItemByTouch(
      firstTouch.state,
      "atlas",
      false,
    );

    expect(secondTouch.shouldNavigate).toBe(false);
    expect(resetExploreInteraction()).toEqual(initialExploreInteractionState);
  });
});

describe("Explore vinyl interaction model", () => {
  it("toggles a touched sleeve and transfers selection between sleeves", () => {
    const opened = toggleBlackDiscByTouch(
      initialBlackDiscInteractionState,
      "night-signal",
    );
    const transferred = toggleBlackDiscByTouch(opened, "red-thread");

    expect(opened).toEqual({
      activeSlug: "night-signal",
      activationSource: "touch",
    });
    expect(transferred).toEqual({
      activeSlug: "red-thread",
      activationSource: "touch",
    });
    expect(toggleBlackDiscByTouch(transferred, "red-thread")).toEqual(
      initialBlackDiscInteractionState,
    );
  });

  it("only closes pointer and keyboard states from their matching source", () => {
    const hovered = activateBlackDisc("night-signal", "mouse");
    const focused = activateBlackDisc("night-signal", "keyboard");

    expect(deactivateBlackDisc(hovered, "night-signal", "mouse")).toEqual(
      initialBlackDiscInteractionState,
    );
    expect(deactivateBlackDisc(focused, "night-signal", "mouse")).toBe(focused);
    expect(deactivateBlackDisc(focused, "night-signal", "keyboard")).toEqual(
      initialBlackDiscInteractionState,
    );
  });

  it("calculates centered and clamped five-degree cursor tilt", () => {
    const bounds = { left: 100, top: 200, width: 400, height: 400 };

    expect(calculateBlackDiscTilt(300, 400, bounds)).toEqual({
      rotateXDeg: 0,
      rotateYDeg: 0,
      lightXPercent: 50,
      lightYPercent: 50,
    });
    expect(calculateBlackDiscTilt(0, 0, bounds)).toEqual({
      rotateXDeg: 5,
      rotateYDeg: -5,
      lightXPercent: 0,
      lightYPercent: 0,
    });
    expect(calculateBlackDiscTilt(900, 900, bounds)).toEqual({
      rotateXDeg: -5,
      rotateYDeg: 5,
      lightXPercent: 100,
      lightYPercent: 100,
    });
  });
});

describe("Explore collection markup", () => {
  it("renders a labelled collection with accessible project controls", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>,
    );

    expect(markup).toContain('aria-label="Work collection"');
    expect(markup).toContain('aria-label="Vinyl work collection"');
    expect(markup).toContain('aria-label="Reveal Night Signal record"');
    expect(markup).toContain('aria-label="Open Factory.app in a new tab"');
    expect(markup).toContain('aria-label="Reveal Atlas cover"');
    expect(markup.match(/class="disc-item"/g)).toHaveLength(
      exploreItems.length,
    );
    expect(markup.match(/class="disc-cuboid"/g)).toHaveLength(
      exploreItems.length,
    );
    expect(markup.match(/class="disc-face /g)).toHaveLength(
      exploreItems.length * 6,
    );
    for (const face of ["front", "back", "spine", "edge", "top", "bottom"]) {
      expect(markup.match(new RegExp(`disc-face-${face}`, "g"))).toHaveLength(
        exploreItems.length,
      );
    }
    expect(markup.match(/target="_blank"/g)).toHaveLength(1);
    expect(markup.match(/class="black-disc"/g)).toHaveLength(
      blackDiscItems.length,
    );
    expect(markup.match(/class="black-disc-record"/g)).toHaveLength(
      blackDiscItems.length,
    );
    expect(markup.match(/class="black-disc-sleeve"/g)).toHaveLength(
      blackDiscItems.length,
    );
  });
});
