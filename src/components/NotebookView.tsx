import { ENTRIES, GUIDE_PATH, joined, REPOSITORY, type Notebook } from "../content";
import { hrefFor } from "../routing";
import { CodeCell } from "./CodeCell";
import { Markdown } from "./Markdown";

const COLAB = "https://colab.research.google.com/github/schwarzschlyle/immune/blob/main";

function SourceLinks({ slug }: { slug: string }) {
  const path = `${GUIDE_PATH}/${slug}.ipynb`;
  return (
    <div className="source-links">
      <a href={`${REPOSITORY}/blob/main/${path}`} target="_blank" rel="noreferrer">
        View notebook on GitHub
      </a>
      <a href={`${COLAB}/${path}`} target="_blank" rel="noreferrer">
        Open in Colab
      </a>
    </div>
  );
}

function Pager({ slug }: { slug: string }) {
  const index = ENTRIES.findIndex((entry) => entry.slug === slug);
  const previous = index > 0 ? ENTRIES[index - 1] : null;
  const next = index >= 0 && index < ENTRIES.length - 1 ? ENTRIES[index + 1] : null;
  return (
    <nav className="pager" aria-label="Previous and next guides">
      {previous ? (
        <a className="pager-link" href={hrefFor({ slug: previous.slug, anchor: null })}>
          <span className="pager-label">Previous</span>
          <span className="pager-title">{previous.title}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a className="pager-link pager-next" href={hrefFor({ slug: next.slug, anchor: null })}>
          <span className="pager-label">Next</span>
          <span className="pager-title">{next.title}</span>
        </a>
      )}
    </nav>
  );
}

export function NotebookView({ slug, notebook }: { slug: string; notebook: Notebook }) {
  return (
    <article className="notebook">
      <SourceLinks slug={slug} />
      {notebook.cells.map((cell, index) => {
        if (cell.cell_type === "markdown") {
          return (
            <div key={index} className="markdown-cell">
              <Markdown text={joined(cell.source)} slug={slug} />
            </div>
          );
        }
        if (cell.cell_type === "code") return <CodeCell key={index} cell={cell} />;
        return null;
      })}
      <Pager slug={slug} />
    </article>
  );
}
