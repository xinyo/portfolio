import type { FactoryMaterial } from "@/apps/factory/store";

export function filterFactoryMaterials(
  materials: FactoryMaterial[],
  query: string,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return materials;
  }

  return materials.filter((material) =>
    [material.name, material.code].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}

export function validateMaterialInput(input: {
  name: string;
  code: string;
  image: string;
}) {
  return {
    name: input.name.trim().length === 0,
    code: input.code.trim().length === 0,
    image: input.image.trim().length === 0,
  };
}
