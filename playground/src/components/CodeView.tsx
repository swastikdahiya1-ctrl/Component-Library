import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("tsx", tsx);
export default function CodeView({ code }: { code: string }) {
  return (
    <SyntaxHighlighter
      language="tsx"
      style={vscDarkPlus}
      showLineNumbers
      customStyle={{
        margin: 0,
        background: "transparent",
        fontSize: 13,
        padding: "24px",
        minHeight: "100%",
      }}
    >
      {code || "// Loading source..."}
    </SyntaxHighlighter>
  );
}
