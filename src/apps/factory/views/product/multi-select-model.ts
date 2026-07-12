export type MultiSelectOption = {
  value: string;
  label: string;
};

export function formatMultiSelectValue(
  options: MultiSelectOption[],
  selectedValues: string[],
  placeholder: string,
  formatMore: (count: number) => string,
) {
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  if (selectedLabels.length === 0) {
    return placeholder;
  }

  if (selectedLabels.length === 1) {
    return selectedLabels[0];
  }

  return `${selectedLabels[0]} ${formatMore(selectedLabels.length - 1)}`;
}
