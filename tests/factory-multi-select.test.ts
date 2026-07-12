import { describe, expect, it } from "vitest";

import { formatMultiSelectValue } from "@/apps/factory/views/product/multi-select-model";

const options = [
  { value: "one", label: "Selection 1" },
  { value: "two", label: "Selection 2" },
  { value: "three", label: "Selection 3" },
  { value: "four", label: "Selection 4" },
  { value: "five", label: "Selection 5" },
];

const formatMore = (count: number) => `+ ${count} more`;

describe("formatMultiSelectValue", () => {
  it("returns the placeholder when nothing is selected", () => {
    expect(
      formatMultiSelectValue(options, [], "Select one or more", formatMore),
    ).toBe("Select one or more");
  });

  it("returns the selected label for one selection", () => {
    expect(
      formatMultiSelectValue(options, ["two"], "Placeholder", formatMore),
    ).toBe("Selection 2");
  });

  it("shows the first option-order selection and remaining count", () => {
    expect(
      formatMultiSelectValue(
        options,
        ["five", "three", "one", "four", "two"],
        "Placeholder",
        formatMore,
      ),
    ).toBe("Selection 1 + 4 more");
  });

  it("ignores stale selected ids in the label and count", () => {
    expect(
      formatMultiSelectValue(
        options,
        ["unknown", "two", "four"],
        "Placeholder",
        formatMore,
      ),
    ).toBe("Selection 2 + 1 more");
  });
});
