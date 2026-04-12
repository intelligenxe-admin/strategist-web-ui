"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div
      className="text-sm text-gray-700 leading-relaxed
        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-5 [&_h2]:mb-2
        [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2
        [&_h4]:text-base [&_h4]:font-medium [&_h4]:text-gray-900 [&_h4]:mt-3 [&_h4]:mb-1
        [&_p]:mb-3
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
        [&_li]:mb-1
        [&_strong]:font-semibold [&_strong]:text-gray-900
        [&_a]:text-blue-600 [&_a]:underline
        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-3
        [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono
        [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-3
        [&_th]:border [&_th]:border-gray-300 [&_th]:px-3 [&_th]:py-2 [&_th]:bg-gray-50 [&_th]:text-left [&_th]:font-medium
        [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2
        [&_hr]:my-6 [&_hr]:border-gray-200"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
