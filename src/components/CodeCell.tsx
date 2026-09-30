import { useState } from "react";
import { joined, type Cell, type Output } from "../content";
import { Markdown } from "./Markdown";

const ANSI = /\u001b\[[0-9;]*[A-Za-z]/g;

function outputText(output: Output): { text: string; kind: string } | null {
  if (output.output_type === "stream") {
    return { text: joined(output.text), kind: output.name === "stderr" ? "stderr" : "stdout" };
  }
  if (output.output_type === "error") {
    return { text: `${output.ename ?? "Error"}: ${output.evalue ?? ""}`, kind: "error" };
  }
  const plain = output.data?.["text/plain"];
  return plain === undefined ? null : { text: joined(plain), kind: "result" };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy-button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        });
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function CodeCell({ cell }: { cell: Cell }) {
  const source = joined(cell.source);
  const outputs = (cell.outputs ?? []).map(outputText).filter((item) => item !== null);
  return (
    <div className="code-cell">
      <div className="cell-input">
        <div className="cell-label">
          <span>In [{cell.execution_count ?? " "}]</span>
          <CopyButton text={source} />
        </div>
        <Markdown text={`\`\`\`\`python\n${source}\n\`\`\`\``} slug={null} />
      </div>
      {outputs.length > 0 && (
        <div className="cell-output">
          <div className="cell-label">
            <span>Out</span>
          </div>
          {outputs.map((output, index) => (
            <pre key={index} className={`output output-${output.kind}`}>
              {output.text.replace(ANSI, "")}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}
