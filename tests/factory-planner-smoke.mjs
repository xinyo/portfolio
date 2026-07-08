import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const port = 5178;
const baseUrl = `http://127.0.0.1:${port}`;
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

function startServer() {
  return spawn("pnpm", ["exec", "vite", "--host", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    stdio: "pipe",
  });
}

async function waitForServer(server) {
  const started = Date.now();
  let output = "";

  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  while (Date.now() - started < 30_000) {
    if (server.exitCode != null) {
      throw new Error(
        `Vite exited before becoming ready with code ${server.exitCode}\n${output}`,
      );
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error(`Timed out waiting for Vite to start\n${output}`);
}

async function runSmoke() {
  const server = startServer();
  await waitForServer(server);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  try {
    await page.goto(`${baseUrl}/apps/factory/planners`);
    await page.getByRole("link", { name: "Back to Overview" }).waitFor();
    await page
      .getByRole("navigation", { name: "Factory navigation" })
      .getByRole("heading", { name: "Customers" })
      .waitFor();
    await page.getByRole("textbox", { name: "Search customers..." }).fill("BuildCorp");
    await page.getByRole("listitem", { name: /BuildCorp Industries/ }).waitFor();

    await page.getByRole("button", { name: "Month", exact: true }).click();
    await page.locator(".fc-dayGridMonth-view").waitFor();
    await page.getByRole("button", { name: "Day", exact: true }).click();
    await page.locator(".fc-timeGridDay-view").waitFor();
    await page.getByRole("button", { name: "Week", exact: true }).click();
    await page.locator(".fc-timeGridWeek-view").waitFor();

    const customer = page.getByRole("listitem", { name: /BuildCorp Industries/ });
    const slot = page.locator(".fc-timegrid-slot-lane").nth(18);
    await customer.dragTo(slot, { force: true });
    await page.locator(".fc-event", { hasText: "BuildCorp Industries" }).waitFor();

    await customer.dragTo(slot, { force: true });
    await page.waitForTimeout(300);

    const eventCount = await page
      .locator(".fc-event", { hasText: "BuildCorp Industries" })
      .count();
    if (eventCount !== 1) {
      throw new Error(`Expected one non-overlapping booking, found ${eventCount}`);
    }
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

runSmoke().catch((error) => {
  console.error(error);
  process.exit(1);
});
