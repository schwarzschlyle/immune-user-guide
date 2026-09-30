import { useEffect, useState } from "react";
import { GUIDE_PATH, REPOSITORY } from "./content";

export interface Route {
  slug: string | null;
  anchor: string | null;
}

export type LinkTarget =
  | { kind: "route"; route: Route }
  | { kind: "anchor"; anchor: string }
  | { kind: "external"; href: string };

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** The overview page's name in URLs, used when linking to a section of it. */
const HOME = "overview";

/** Routes live in the hash (#/03_openai_chat_completions/1.-A-multi-turn-assistant), so any static host works. */
export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "");
  if (!path) return { slug: null, anchor: null };
  const [slug, ...rest] = path.split("/");
  return {
    slug: slug && slug !== HOME ? slug : null,
    anchor: rest.length ? decode(rest.join("/")) : null,
  };
}

export function hrefFor(route: Route): string {
  const anchor = route.anchor ? `/${encodeURIComponent(route.anchor)}` : "";
  if (!route.slug) return anchor ? `#/${HOME}${anchor}` : "#/";
  return `#/${route.slug}${anchor}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const update = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return route;
}

/** Resolve a link written in a notebook: other guides, anchors on the page, or files elsewhere in the repository. */
export function resolveLink(href: string): LinkTarget {
  if (/^(https?:|mailto:)/i.test(href)) return { kind: "external", href };
  if (href.startsWith("#")) return { kind: "anchor", anchor: decode(href.slice(1)) };
  const notebook = href.match(/^(?:\.\/)?([\w-]+)\.ipynb(?:#(.*))?$/);
  if (notebook) {
    return { kind: "route", route: { slug: notebook[1], anchor: notebook[2] ? decode(notebook[2]) : null } };
  }
  if (/^(?:\.\/)?README\.md$/i.test(href)) return { kind: "route", route: { slug: null, anchor: null } };
  const resolved = new URL(href, `https://repository.invalid/${GUIDE_PATH}/`);
  const path = resolved.pathname.replace(/^\//, "");
  const isFile = /\.[A-Za-z0-9]+$/.test(path);
  return { kind: "external", href: `${REPOSITORY}/${isFile ? "blob" : "tree"}/main/${path}${resolved.hash}` };
}

export function scrollToAnchor(anchor: string | null): void {
  if (!anchor) {
    window.scrollTo({ top: 0 });
    return;
  }
  const element = document.getElementById(anchor);
  if (element) element.scrollIntoView({ block: "start" });
}
