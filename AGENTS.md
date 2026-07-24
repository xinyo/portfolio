# principle

- When the `#plan` command is triggered, always ask if anything is not clear/missing, DO NOT make assumption.
- Ask for confirmation before adding new production dependencies.

- PR must include a changes summary in the description.
- Branch names and PR titles must follow semantic conventions.

- All functional changes should be covered by unit tests.

# Apps

- Each app in apps folder is an independent, self-contained unit.
- CSS styles must be strictly scoped to their parent app.
- When making plan for a certain App with UI changes, READ its corresponding design.md to understand its boundaries.

# frontend

- prefer use `pnpm` instead of `npm`.
- Always run `pnpm test` after finished modify JavaScript/Typescript files, no confirmation required.
- text content or label prefer translated.
- Use `vitest` for the testing framework. All test files should be place in /tests folder.
- Prefer form element / component have aria label to meet WACG requirement.
- Use javascript Date is forbidden in src and tests. Always use Temporal.
- large dataset in store prefer indexed by id, prefer Record type or Map, Set, but not array.
- animation/transition UI changes prefer have a dev control panel with slider to control ALL the UI animation/transition values, include but no limit to mouse track event, tilt angle/duration/gap/ease...etc.


<!-- - Mock external dependencies like `uuid` in tests. -->
