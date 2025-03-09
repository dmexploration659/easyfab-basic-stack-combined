import { CSSProperties } from 'react';

declare module 'react-syntax-highlighter' {
    import * as React from 'react';
  
    export interface SyntaxHighlighterProps {
      language?: string;
      style?: Record<string, string | number>;
      children?: string;
    }
  
    export const Light: React.FC<SyntaxHighlighterProps>;
    export const Prism: React.FC<SyntaxHighlighterProps>;
  }
  
  declare module 'react-syntax-highlighter/dist/cjs/styles/hljs' {
    export const docco: { [key: string]: CSSProperties };
  }
  