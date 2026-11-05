// Checks that every local file and in-page anchor referenced by the HTML pages exists.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? ".");
const pages = process.argv.slice(3).length > 0 ? process.argv.slice(3) : ["index.html", "404.html"];
const errors = [];

for (const page of pages) {
  const html = readFileSync(join(root, page), "utf8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

  for (const [, attribute, value] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(value)) continue;

    if (value.startsWith("#")) {
      if (value.length > 1 && !ids.has(value.slice(1))) errors.push(`${page}: no existe el ancla ${value}`);
      continue;
    }

    const path = value.split(/[?#]/)[0];
    const target = path.startsWith("/") ? join(root, path) : join(root, dirname(page), path);
    const file = path === "/" || path.endsWith("/") ? join(target, "index.html") : target;
    if (!existsSync(file)) errors.push(`${page}: ${attribute}="${value}" apunta a un archivo que no existe`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Enlaces correctos en ${pages.join(", ")}.`);
