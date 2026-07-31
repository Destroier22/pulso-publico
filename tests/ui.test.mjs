import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("painel contém narrativa, filtros e fontes", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /Do cofre .*à rua/);
  assert.match(page, /aria-label="Filtrar por região"/);
  assert.match(page, /METODOLOGIA/);
});
