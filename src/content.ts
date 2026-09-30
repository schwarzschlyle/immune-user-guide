import readmeText from "./notebooks/README.md?raw";

export const REPOSITORY = "https://github.com/schwarzschlyle/immune";
export const GUIDE_PATH = "notebooks/user_guide";

export interface Output {
  output_type: "stream" | "execute_result" | "display_data" | "error";
  name?: string;
  text?: string | string[];
  data?: Record<string, string | string[]>;
  ename?: string;
  evalue?: string;
}

export interface Cell {
  cell_type: "markdown" | "code" | "raw";
  source: string | string[];
  execution_count?: number | null;
  outputs?: Output[];
}

export interface Notebook {
  cells: Cell[];
}

export interface GuideEntry {
  slug: string;
  title: string;
  group: string;
}

export interface GuideGroup {
  name: string;
  entries: GuideEntry[];
}

export interface Section {
  id: string;
  title: string;
}

export const README = readmeText;

/** The guide's README lists every notebook under "## Guides", grouped by "### Group" headings. */
export function parseGroups(readme: string): GuideGroup[] {
  const groups: GuideGroup[] = [];
  let inGuides = false;
  for (const line of readme.split("\n")) {
    if (line.startsWith("## ")) {
      inGuides = line.trim() === "## Guides";
      continue;
    }
    if (!inGuides) continue;
    if (line.startsWith("### ")) {
      groups.push({ name: line.slice(4).trim(), entries: [] });
      continue;
    }
    const match = line.match(/^- \*\*\[(.+?)\]\(([\w-]+)\.ipynb\)\*\*/);
    if (match && groups.length > 0) {
      const group = groups[groups.length - 1];
      group.entries.push({ title: match[1], slug: match[2], group: group.name });
    }
  }
  return groups;
}

export const GROUPS = parseGroups(README);
export const ENTRIES = GROUPS.flatMap((group) => group.entries);

const loaders = import.meta.glob<string>("./notebooks/*.ipynb", { query: "?raw", import: "default" });

export async function loadNotebook(slug: string): Promise<Notebook> {
  const loader = loaders[`./notebooks/${slug}.ipynb`];
  if (!loader) throw new Error(`There is no guide named "${slug}".`);
  return JSON.parse(await loader()) as Notebook;
}

export function joined(source: string | string[] | undefined): string {
  if (source === undefined) return "";
  return Array.isArray(source) ? source.join("") : source;
}

/** Jupyter's heading anchors: the heading's text with spaces replaced by hyphens. */
export function anchorFor(text: string): string {
  return text.trim().replace(/\s+/g, "-");
}

/** The plain text of a markdown heading, as a browser would render it. */
export function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/(^|\s)\*([^*]+)\*/g, "$1$2")
    .trim();
}

export function sectionsOf(markdown: string[]): Section[] {
  const sections: Section[] = [];
  let fenced = false;
  for (const cell of markdown) {
    for (const line of cell.split("\n")) {
      if (line.startsWith("```")) fenced = !fenced;
      if (!fenced && line.startsWith("## ")) {
        const title = plainText(line.slice(3));
        sections.push({ id: anchorFor(title), title });
      }
    }
  }
  return sections;
}

export function titleOf(slug: string): string {
  return ENTRIES.find((entry) => entry.slug === slug)?.title ?? slug;
}
