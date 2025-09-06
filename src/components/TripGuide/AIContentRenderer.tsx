'use client';

import React from 'react';

interface AIContentRendererProps {
  content: string;
  className?: string;
}

interface ParsedSection {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list' | 'accent-block';
  content: string;
  items?: string[];
}

// Function to render markdown-like formatting within text
const renderFormattedText = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let partIndex = 0;

  // Process **bold** text
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.slice(currentIndex, match.index));
    }
    
    // Add the bold text
    parts.push(
      <strong key={`bold-${partIndex++}`} className="alfie-guide-bold">
        {match[1]}
      </strong>
    );
    
    currentIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

export default function AIContentRenderer({ content, className = '' }: AIContentRendererProps): JSX.Element {
  const parseContent = (text: string): ParsedSection[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sections: ParsedSection[] = [];
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Headers detection - both markdown and smart detection
      if (line.startsWith('### ')) {
        sections.push({
          type: 'h3',
          content: line.replace('### ', '').trim()
        });
      } else if (line.startsWith('## ')) {
        sections.push({
          type: 'h2',
          content: line.replace('## ', '').trim()
        });
      } else if (line.startsWith('# ')) {
        sections.push({
          type: 'h1',
          content: line.replace('# ', '').trim()
        });
      }
      // Smart header detection - detect titles/headings without markdown
      else if (
        line.match(/^[A-Z][^.!?]*:$/) || // "Title:"
        line.match(/^[A-Z][A-Za-z\s]{10,50}$/) || // "Trip Type Single Destination"
        line.match(/^(Day \d+|Why This Route Works|Trip Overview|Itinerary|Activities|Recommendations|Adventure Idea|Why this works)/) ||
        line.match(/^🏖️.*/) || // Lines starting with travel emojis
        line.match(/^✈️.*/) || 
        line.match(/^🚗.*/) ||
        line.match(/^🏞️.*/) ||
        line.match(/^🏕️.*/) ||
        line.match(/^🌍.*/) ||
        line.match(/^⭐.*/) ||
        line.match(/^💰.*/) ||
        (line.length > 10 && line.length < 100 && !line.includes('.') && line === line.trim() && (/^[A-Z]/.test(line) || /^[🏖️🚗✈️🏞️🏕️🌍⭐💰]/.test(line)))
      ) {
        sections.push({
          type: 'h2',
          content: line.replace(':', '').trim()
        });
      }
      // Detect lists (starting with -, *, or numbers)
      else if (line.match(/^[-*•]\s+/) || line.match(/^\d+\.\s+/)) {
        const listItems: string[] = [];
        
        // Collect all consecutive list items
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          if (currentLine.match(/^[-*•]\s+/) || currentLine.match(/^\d+\.\s+/)) {
            listItems.push(currentLine.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, ''));
            i++;
          } else {
            i--; // Step back to process this line in the next iteration
            break;
          }
        }
        
        sections.push({
          type: 'list',
          content: '',
          items: listItems
        });
      }
      // Detect accent blocks (lines with specific keywords or emphasis)
      else if (line.match(/^(ВАЖНО|Important|Note|Tip|Warning|Pro Tip):/i) || 
               line.includes('⚠️') || line.includes('💡') || line.includes('⭐') || 
               line.includes('🔥') || line.includes('👉')) {
        sections.push({
          type: 'accent-block',
          content: line
        });
      }
      // Regular paragraphs
      else if (line.length > 0) {
        // Split very long text into sentences and create paragraphs
        let paragraph = line;
        let j = i + 1;
        
        // Collect consecutive lines for paragraph (but avoid headers)
        while (j < lines.length && 
               !lines[j].trim().match(/^#{1,3}\s+/) &&
               !lines[j].trim().match(/^[-*•]\s+/) &&
               !lines[j].trim().match(/^\d+\.\s+/) &&
               !lines[j].trim().match(/^(ВАЖНО|Important|Note|Tip|Warning|Pro Tip):/i) &&
               !lines[j].trim().match(/^[A-Z][^.!?]*:$/) &&
               !lines[j].trim().match(/^(Day \d+|Why This Route Works|Trip Overview|Itinerary|Activities|Recommendations)/) &&
               lines[j].trim() !== '') {
          paragraph += ' ' + lines[j].trim();
          j++;
        }
        
        // Break very long paragraphs into smaller ones
        if (paragraph.length > 400) {
          const sentences = paragraph.split(/(?<=[.!?])\s+/);
          let currentParagraph = '';
          
          for (const sentence of sentences) {
            if (currentParagraph.length + sentence.length > 300 && currentParagraph.length > 0) {
              sections.push({
                type: 'paragraph',
                content: currentParagraph.trim()
              });
              currentParagraph = sentence;
            } else {
              currentParagraph += (currentParagraph ? ' ' : '') + sentence;
            }
          }
          
          if (currentParagraph.trim()) {
            sections.push({
              type: 'paragraph',
              content: currentParagraph.trim()
            });
          }
        } else {
          sections.push({
            type: 'paragraph',
            content: paragraph
          });
        }
        
        i = j - 1; // Adjust index
      }
      
      i++;
    }
    
    return sections;
  };

  const renderSection = (section: ParsedSection, index: number): JSX.Element => {
    switch (section.type) {
      case 'h1':
        return (
          <h1 key={index} className="alfie-guide-h1">
            {renderFormattedText(section.content)}
          </h1>
        );
        
      case 'h2':
        return (
          <h2 key={index} className="alfie-guide-h2">
            {renderFormattedText(section.content)}
          </h2>
        );
        
      case 'h3':
        return (
          <h3 key={index} className="alfie-guide-h3">
            {renderFormattedText(section.content)}
          </h3>
        );
        
      case 'list':
        return (
          <ul key={index} className="alfie-guide-list">
            {section.items?.map((item, itemIndex) => (
              <li key={itemIndex} className="alfie-guide-list-item">
                {renderFormattedText(item)}
              </li>
            ))}
          </ul>
        );
        
      case 'accent-block':
        return (
          <div key={index} className="alfie-guide-accent-block">
            <div className="alfie-guide-accent-content">
              {renderFormattedText(section.content)}
            </div>
          </div>
        );
        
      case 'paragraph':
        return (
          <p key={index} className="alfie-guide-paragraph">
            {renderFormattedText(section.content)}
          </p>
        );
        
      default:
        return (
          <p key={index} className="alfie-guide-paragraph">
            {renderFormattedText(section.content)}
          </p>
        );
    }
  };

  const sections = parseContent(content);

  return (
    <div className={`alfie-guide-content ${className}`}>
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
}