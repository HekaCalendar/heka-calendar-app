/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    HEKA MARKDOWN EDITOR — Milkdown Integration             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useRef } from 'react';
import { Milkdown, useEditor, MilkdownProvider } from '@milkdown/react';
import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core';
import { commonmark } from '@milkdown/preset-commonmark';
import { nord } from '@milkdown/theme-nord';
import { listener, listenerCtx } from '@milkdown/plugin-listener';

interface MarkdownEditorCoreProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MarkdownEditorCore: React.FC<MarkdownEditorCoreProps> = ({
  value,
  onChange,
  placeholder,
  readOnly,
  className,
  style,
}) => {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEditor((root) => {
    return Editor
      .make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, value);
        const listenerAPI = ctx.get(listenerCtx);
        listenerAPI.markdownUpdated((_ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            onChangeRef.current(markdown);
          }
        });
      })
      .config(nord)
      .use(commonmark)
      .use(listener);
  }, []);

  // Note: We intentionally do NOT sync external `value` changes back into
  // Milkdown to avoid cursor jumps. User edits drive state via onChange.

  return (
    <div
      className={`milkdown-editor ${className || ''} ${readOnly ? 'readonly' : ''}`}
      style={{
        '--milkdown-placeholder': placeholder ? `'${placeholder}'` : undefined,
        ...style,
      } as React.CSSProperties}
    >
      <Milkdown />
    </div>
  );
};

export const MarkdownEditor: React.FC<MarkdownEditorCoreProps> = (props) => {
  return (
    <MilkdownProvider>
      <MarkdownEditorCore {...props} />
    </MilkdownProvider>
  );
};
