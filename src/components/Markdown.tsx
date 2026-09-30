import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import diff from "highlight.js/lib/languages/diff";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import yaml from "highlight.js/lib/languages/yaml";
import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { anchorFor } from "../content";
import { hrefFor, resolveLink } from "../routing";

// Only the languages the guide uses, which keeps the bundle small.
for (const [name, language] of Object.entries({ bash, diff, json, python, yaml })) {
  hljs.registerLanguage(name, language);
}

interface HastNode {
  type: string;
  value?: string;
  children?: HastNode[];
}

function textOf(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

interface MarkdownProps {
  text: string;
  /** The guide this text belongs to, so that "#anchor" links and heading links stay on that guide. */
  slug: string | null;
}

export function Markdown({ text, slug }: MarkdownProps) {
  const anchorHref = (anchor: string) => hrefFor({ slug, anchor });

  const heading = (level: 1 | 2 | 3 | 4) =>
    function Heading({ node, children }: { node?: HastNode; children?: ReactNode }) {
      const Tag = `h${level}` as const;
      const id = anchorFor(textOf(node));
      return (
        <Tag id={id}>
          {children}
          <a className="heading-anchor" href={anchorHref(id)} aria-label="Link to this section">
            #
          </a>
        </Tag>
      );
    };

  const components: Components = {
    h1: heading(1),
    h2: heading(2),
    h3: heading(3),
    h4: heading(4),
    a({ href = "", children }) {
      const target = resolveLink(href);
      if (target.kind === "external") {
        return (
          <a href={target.href} target="_blank" rel="noreferrer">
            {children}
          </a>
        );
      }
      if (target.kind === "route") return <a href={hrefFor(target.route)}>{children}</a>;
      return <a href={anchorHref(target.anchor)}>{children}</a>;
    },
    code({ className, children }) {
      const language = /language-(\w+)/.exec(className ?? "")?.[1];
      if (!language || !hljs.getLanguage(language)) return <code className={className}>{children}</code>;
      // highlight.js escapes the source, so its HTML is safe to insert.
      const html = hljs.highlight(String(children).replace(/\n$/, ""), { language, ignoreIllegals: true }).value;
      return <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />;
    },
    table({ children }) {
      return (
        <div className="table-scroll">
          <table>{children}</table>
        </div>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {text}
    </ReactMarkdown>
  );
}
