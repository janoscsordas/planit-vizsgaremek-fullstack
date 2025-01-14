import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function MarkdownDescription({
  description,
}: {
  description: string
}) {
  return (
    <div className="prose dark:prose-invert text-[1rem] w-full max-w-none">
      <ReactMarkdown className="" remarkPlugins={[remarkGfm]}>
        {description}
      </ReactMarkdown>
    </div>
  )
}
