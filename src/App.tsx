import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Markdown } from "./components/Markdown";
import { NotebookView } from "./components/NotebookView";
import { Sidebar } from "./components/Sidebar";
import { joined, loadNotebook, README, sectionsOf, titleOf, type Notebook } from "./content";
import { hrefFor, scrollToAnchor, useRoute } from "./routing";
import { useTheme } from "./theme";

type Loaded = { slug: string; notebook: Notebook } | { slug: string; error: string };

function useNotebook(slug: string | null): Loaded | null {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  useEffect(() => {
    if (!slug) return;
    let current = true;
    loadNotebook(slug).then(
      (notebook) => current && setLoaded({ slug, notebook }),
      (error: unknown) => current && setLoaded({ slug, error: error instanceof Error ? error.message : String(error) }),
    );
    return () => {
      current = false;
    };
  }, [slug]);
  return slug && loaded?.slug === slug ? loaded : null;
}

export function App() {
  const route = useRoute();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const loaded = useNotebook(route.slug);
  const notebook = loaded && "notebook" in loaded ? loaded.notebook : null;

  const sections = useMemo(
    () =>
      notebook
        ? sectionsOf(notebook.cells.filter((cell) => cell.cell_type === "markdown").map((cell) => joined(cell.source)))
        : [],
    [notebook],
  );

  useEffect(() => {
    setMenuOpen(false);
    document.title = route.slug ? `${titleOf(route.slug)} | Immune User Guide` : "Immune User Guide";
  }, [route.slug, route.anchor]);

  // Once the page's content is on screen, jump to the section named in the URL (or the top of a new page).
  const ready = route.slug === null || loaded !== null;
  useLayoutEffect(() => {
    if (ready) scrollToAnchor(route.anchor);
  }, [ready, route.slug, route.anchor]);

  let content;
  if (route.slug === null) {
    content = (
      <article className="notebook overview">
        <Markdown text={README} slug={null} />
      </article>
    );
  } else if (loaded === null) {
    content = <p className="status">Loading…</p>;
  } else if ("error" in loaded) {
    content = (
      <div className="status">
        <h1>Page not found</h1>
        <p>{loaded.error}</p>
        <p>
          <a href={hrefFor({ slug: null, anchor: null })}>Back to the user guide</a>
        </p>
      </div>
    );
  } else {
    content = <NotebookView slug={loaded.slug} notebook={loaded.notebook} />;
  }

  return (
    <div className="layout">
      <Header theme={theme} onToggleTheme={toggleTheme} onToggleMenu={() => setMenuOpen((open) => !open)} />
      <Sidebar route={route} sections={sections} open={menuOpen} />
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
      <main className="content">{content}</main>
    </div>
  );
}
