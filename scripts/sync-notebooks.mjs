// Copy the user guide's notebooks and index from a checkout of the Immune repository into src/notebooks.
//
//   npm run sync                          # expects the repository at ../immune-ai
//   npm run sync -- /path/to/immune       # or pass its location
//   IMMUNE_REPO=/path/to/immune npm run sync

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repository = resolve(process.argv[2] ?? process.env.IMMUNE_REPO ?? join(root, "..", "immune-ai"));
const source = join(repository, "notebooks", "user_guide");
const target = join(root, "src", "notebooks");

if (!existsSync(join(source, "README.md"))) {
  console.error(`No user guide at ${source}. Pass the repository's location: npm run sync -- /path/to/immune`);
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

const files = readdirSync(source).filter((name) => name.endsWith(".ipynb") || name === "README.md");
for (const name of files) copyFileSync(join(source, name), join(target, name));
console.log(`Copied ${files.length} files from ${source}`);
