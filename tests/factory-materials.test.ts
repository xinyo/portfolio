import { beforeEach, describe, expect, it } from "vitest";

import {
  filterFactoryMaterials,
  validateMaterialInput,
} from "@/apps/factory/material-model";
import { factoryMaterials, useFactoryStore } from "@/apps/factory/store";

describe("factory material filtering", () => {
  it("filters by material name without case sensitivity", () => {
    const results = filterFactoryMaterials(factoryMaterials, "carbon STEEL");

    expect(results.map((material) => material.name)).toEqual([
      "Carbon Steel Sheet 2mm",
    ]);
  });

  it("filters by material code without case sensitivity", () => {
    const results = filterFactoryMaterials(factoryMaterials, "abs-175");

    expect(results.map((material) => material.code)).toEqual(["ABS-175-01"]);
  });

  it("returns all materials for blank search and none for no match", () => {
    expect(filterFactoryMaterials(factoryMaterials, "  ")).toBe(
      factoryMaterials,
    );
    expect(filterFactoryMaterials(factoryMaterials, "not-a-material")).toEqual(
      [],
    );
  });
});

describe("factory material creation", () => {
  beforeEach(() => {
    useFactoryStore.setState({ materials: [...factoryMaterials] });
  });

  it("requires name, code, and image", () => {
    expect(validateMaterialInput({ name: "", code: " ", image: "" })).toEqual(
      { name: true, code: true, image: true },
    );
    expect(
      validateMaterialInput({
        name: "Steel rod",
        code: "ROD-1",
        image: "https://example.com/rod.jpg",
      }),
    ).toEqual({ name: false, code: false, image: false });
  });

  it("adds a material to store state", () => {
    const material = {
      id: "mat-test",
      name: "Steel rod",
      code: "ROD-1",
      image: "https://example.com/rod.jpg",
    };

    useFactoryStore.getState().addMaterial(material);

    expect(useFactoryStore.getState().materials).toContainEqual(material);
  });
});
