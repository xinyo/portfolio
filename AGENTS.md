# principle

- When the `#plan` command is triggered, ask for confirmation before executing.
- Ask for confirmation before adding new production dependencies.

- PR must include a changes summary in the description.
- Branch names and PR titles must follow semantic conventions.

- All functional changes should be covered by unit tests.

# Apps

- Each app in apps folder is an independent, self-contained unit.
- CSS styles must be strictly scoped to their parent app.
- Before writing or modifying any app, READ its corresponding design.md to understand its boundaries

# frontend

- prefer use `pnpm` instead of `npm`.
- Always run `pnpm test` after modifying JavaScript/Typescript files.
- Use `vitest` for the testing framework.
- Form component should always have aria to meet WACG requirement.
- Use javascript Date is forbidden in src and tests. Always use Temporal.

<!-- - Mock external dependencies like `uuid` in tests. -->
