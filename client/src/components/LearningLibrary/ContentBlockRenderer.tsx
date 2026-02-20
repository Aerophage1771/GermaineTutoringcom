import type { ContentBlock } from "@/types/studentLibrary";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Renders **text** as bold. Content is from trusted JSON. */
function renderInlineMarkdown(html: string): string {
  return html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function BlockParagraph({ text }: { text: string }) {
  const html = renderInlineMarkdown(text);
  return (
    <p
      className="text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function BlockList({
  items,
  ordered,
}: {
  items: string[];
  ordered?: boolean }) {
  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered
    ? "list-decimal list-inside space-y-1"
    : "list-disc list-inside space-y-1";
  return (
    <ListTag className={`${listClass} text-gray-700 my-2`}>
      {items.map((item, i) => {
        const html = renderInlineMarkdown(item);
        return (
          <li
            key={i}
            className="pl-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </ListTag>
  );
}

function BlockCallout({
  title,
  variant,
  text,
}: {
  title?: string;
  variant?: string;
  text: string;
}) {
  const isSummary = variant === "summary";
  const bg = isSummary ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200";
  return (
    <div className={`my-4 p-4 rounded-lg border ${bg}`}>
      {title && (
        <p className="font-semibold text-gray-900 mb-2">{title}</p>
      )}
      <p
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
      />
    </div>
  );
}

function BlockBreakdown({
  labels,
  items,
}: {
  labels: { title: string; text: string };
  items: Array<{ title: string; text: string; badge?: string; badgeColor?: string }>;
}) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 font-semibold">{labels.title}</th>
            <th className="text-left p-2 font-semibold">{labels.text}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i} className="border-t border-gray-200">
              <td className="p-2 align-top">
                <span className="font-medium">{row.title}</span>
                {row.badge && (
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                      row.badgeColor === "indigo"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {row.badge}
                  </span>
                )}
              </td>
              <td
                className="p-2 text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: renderInlineMarkdown(row.text.replace(/\n/g, "<br />")),
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockOptions({ items }: { items: string[] }) {
  return (
    <div className="my-4 space-y-2">
      {items.map((item, i) => {
        const html = renderInlineMarkdown(item);
        const isCorrect = item.includes("(Correct)");
        return (
          <div
            key={i}
            className={`p-3 rounded border text-sm ${
              isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </div>
  );
}

function BlockProcess({ steps }: { steps: string[] }) {
  return (
    <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700 font-medium">
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  );
}

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="text-xl font-bold text-gray-900 mt-6 mb-2">{block.text}</h2>;
    case "h3":
      return <h3 className="text-lg font-semibold text-gray-900 mt-5 mb-2">{block.text}</h3>;
    case "h4":
      return <h4 className="text-base font-semibold text-gray-800 mt-4 mb-1">{block.text}</h4>;
    case "paragraph":
      return <BlockParagraph text={block.text} />;
    case "list":
      return <BlockList items={block.items} ordered={block.ordered} />;
    case "blockquote":
      return (
        <blockquote
          className="border-l-4 border-gray-300 pl-4 my-3 text-gray-700 italic"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(block.text) }}
        />
      );
    case "hr":
      return <hr className="my-4 border-gray-200" />;
    case "callout":
      return (
        <BlockCallout
          title={block.title}
          variant={block.variant}
          text={block.text}
        />
      );
    case "breakdown":
      return <BlockBreakdown labels={block.labels} items={block.items} />;
    case "accordion":
      return (
        <Accordion type="single" collapsible className="my-3">
          <AccordionItem value="one" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline font-medium">
              {block.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                {block.content}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    case "options":
      return <BlockOptions items={block.items} />;
    case "process":
      return <BlockProcess steps={block.steps} />;
    default:
      return null;
  }
}
