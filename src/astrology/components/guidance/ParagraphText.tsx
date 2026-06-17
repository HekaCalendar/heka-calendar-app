/**
 * ParagraphText
 * Renders a string containing newlines as properly spaced paragraphs.
 * Handles both \n\n (double newline = paragraph break) and \n (single newline = line break).
 */

import React from 'react';

interface ParagraphTextProps {
  text: string;
  paragraphStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

export const ParagraphText: React.FC<ParagraphTextProps> = ({
  text,
  paragraphStyle,
  containerStyle,
}) => {
  if (!text) return null;

  // Split on double newlines first (paragraph breaks), then handle single newlines within each paragraph
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  return (
    <div style={containerStyle}>
      {paragraphs.map((paragraph, index) => {
        // Replace single newlines with <br /> for manual line breaks within a paragraph
        const lines = paragraph.split('\n');
        return (
          <p
            key={index}
            style={{
              margin: index === paragraphs.length - 1 ? 0 : '0 0 1em 0',
              ...paragraphStyle,
            }}
          >
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                {lineIndex < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default ParagraphText;
