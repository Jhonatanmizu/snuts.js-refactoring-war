import { useEffect, useRef } from 'react'
import type { CodeLine } from '@/types/game'

interface CodeEditorProps {
  lines: CodeLine[]
  blanks: { lineIndex: number; expected: string; hint?: string }[]
  typedAnswers: string[]
  onAnswerChange: (index: number, value: string) => void
  readOnly?: boolean
  codeString?: string
  language?: string
  fileName?: string
  showLines?: boolean
  className?: string
}

const tokenColors: Record<string, string> = {
  keyword: 'text-snuts-cyan',
  string: 'text-snuts-yellow',
  number: 'text-snuts-purple',
  function: 'text-snuts-green',
  operator: 'text-snuts-muted',
  comment: 'text-snuts-muted italic',
  variable: 'text-snuts-text',
  property: 'text-snuts-accent',
  punctuation: 'text-snuts-muted',
}

function simpleHighlight(line: string): { text: string; className: string }[] {
  const tokens: { text: string; className: string }[] = []
  const regex = /(\/\/.*|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*`|`(?:[^`\\]|\\.)*`|\b(const|let|var|function|return|test|describe|it|expect|async|await|import|export|from|new|class|if|else|for|of|in|typeof|instanceof)\b|\b(\d+(?:\.\d+)?)\b|([{}()[\];,.:]|=>|===|!==|>=|<=|&&|\|\||[=+\-*/<>!]))/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: line.slice(lastIndex, match.index),
        className: 'text-snuts-text',
      })
    }

    if (match[1]) {
      tokens.push({ text: match[1], className: tokenColors.comment })
    } else if (match[2]) {
      tokens.push({ text: match[2], className: tokenColors.keyword })
    } else if (match[3]) {
      tokens.push({ text: match[3], className: tokenColors.number })
    } else if (match[4]) {
      const punc = match[4]
      if (punc === '(' || punc === ')' || punc === '{' || punc === '}' || punc === '[' || punc === ']' || punc === ';' || punc === ',' || punc === '.') {
        tokens.push({ text: punc, className: tokenColors.punctuation })
      } else {
        tokens.push({ text: punc, className: tokenColors.operator })
      }
    } else if (match[0].startsWith("'") || match[0].startsWith('"') || match[0].startsWith('`')) {
      tokens.push({ text: match[0], className: tokenColors.string })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < line.length) {
    tokens.push({
      text: line.slice(lastIndex),
      className: 'text-snuts-text',
    })
  }

  return tokens.length > 0 ? tokens : [{ text: line, className: 'text-snuts-text' }]
}

export function CodeEditor({
  lines,
  blanks,
  typedAnswers,
  onAnswerChange,
  readOnly = false,
  codeString,
  language,
  fileName,
  showLines = true,
  className = '',
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!readOnly && blanks.length > 0 && editorRef.current) {
      const firstBlank = editorRef.current.querySelector<HTMLInputElement>('[data-blank-index="0"] input')
      firstBlank?.focus()
    }
  }, [])

  return (
    <div
      ref={editorRef}
      className={`rounded-xl bg-snuts-code border border-snuts-border overflow-hidden ${className}`}
    >
      {(fileName || language) && (
        <div className="flex items-center gap-3 px-4 py-2 bg-snuts-surface-3 border-b border-snuts-border">
          {fileName && (
            <span className="text-snuts-muted font-code text-xs">{fileName}</span>
          )}
          {language && (
            <span className="text-snuts-cyan font-code text-xs">{language}</span>
          )}
        </div>
      )}

      <div className="p-4 font-code text-sm leading-relaxed overflow-auto">
        {lines.map((line, lineIdx) => {
          const blankIdx = blanks.findIndex((b) => b.lineIndex === lineIdx)
          const isBlank = blankIdx >= 0

          return (
            <div
              key={lineIdx}
              className={`flex gap-4 py-[2px] ${
                line.highlight === 'smell'
                  ? 'bg-snuts-red/10 border-l-2 border-snuts-red pl-3 -ml-4'
                  : line.highlight === 'fix'
                    ? 'bg-snuts-green/10 border-l-2 border-snuts-green pl-3 -ml-4'
                    : line.highlight === 'blank'
                      ? 'bg-snuts-cyan/10 border-l-2 border-snuts-cyan pl-3 -ml-4'
                      : 'pl-4'
              }`}
            >
              {showLines && (
                <span className="text-snuts-muted/50 w-8 flex-shrink-0 text-right select-none">
                  {String(lineIdx + 1).padStart(2, '0')}
                </span>
              )}

              <div className="flex-1 flex items-center gap-1 flex-wrap">
                {isBlank && !readOnly ? (
                  <>
                    {(() => {
                      const parts = line.text.split('____')
                      return parts.map((part, pi) => (
                        <span key={pi} className="flex items-center gap-0">
                          {pi > 0 && (
                            <span className="inline-flex items-center">
                              <input
                                data-blank-index={blankIdx}
                                type="text"
                                value={typedAnswers[blankIdx] ?? ''}
                                onChange={(e) => onAnswerChange(blankIdx, e.target.value)}
                                className="w-28 bg-snuts-overlay border-b-2 border-snuts-cyan text-snuts-cyan font-code text-sm outline-none px-1 py-0.5 rounded caret-snuts-cyan transition-all duration-200 focus:w-36 focus:bg-snuts-surface-2"
                                placeholder="______"
                              />
                            </span>
                          )}
                          {part && (
                            <span className="text-snuts-text whitespace-pre">{part}</span>
                          )}
                        </span>
                      ))
                    })()}
                  </>
                ) : (
                  <span className="text-snuts-text whitespace-pre">
                    {line.text || '\u00A0'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {codeString && readOnly && (
        <div className="p-4 pt-0 font-code text-sm leading-relaxed">
          <pre className="text-snuts-text whitespace-pre-wrap">{codeString}</pre>
        </div>
      )}
    </div>
  )
}

export function SyntaxHighlightedCode({ code }: { code: string; language?: string }) {
  const lines = code.split('\n')
  return (
    <div className="rounded-xl bg-snuts-code border border-snuts-border overflow-hidden h-full">
      <div className="p-4 font-code text-sm leading-relaxed overflow-auto h-full">
        {lines.map((line, i) => {
          const tokens = simpleHighlight(line)
          return (
            <div key={i} className="flex gap-4 py-[2px]">
              <span className="text-snuts-muted/50 w-8 flex-shrink-0 text-right select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">
                {tokens.map((token, j) => (
                  <span key={j} className={token.className}>{token.text}</span>
                ))}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function simpleHighlightTokens(line: string): { text: string; className: string }[] {
  return simpleHighlight(line)
}
