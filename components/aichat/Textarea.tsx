"use client";

import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useRef } from "react";

export default function TextArea({ 
    name, 
    id, 
    placeholder, 
    className,
    required,
    disabled,
}: { 
    name: string, 
    id: string, 
    placeholder: string, 
    className: string,
    required: boolean,
    disabled?: boolean,
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultRows = 1;
  const maxRows = undefined; // You can set a max number of rows

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";

    const style = window.getComputedStyle(textarea);
    const borderHeight = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
    const paddingHeight = parseInt(style.paddingTop) + parseInt(style.paddingBottom);

    const lineHeight = parseInt(style.lineHeight);
    const maxHeight = maxRows ? lineHeight * maxRows + borderHeight + paddingHeight : Infinity;

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
  };

  return (
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        ref={textareaRef}
        onChange={handleInput}
        rows={defaultRows}
        className={className}
        required={required}
      />
  );
}