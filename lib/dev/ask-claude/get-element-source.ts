const PATH_ATTRIBUTE = "data-insp-path"

export interface ElementSource {
  file: string
  line: number
  column: number
}

/**
 * Reads the `data-insp-path` attribute that `code-inspector-plugin` stamps on
 * every JSX element at build time (`file:line:column:tag`, file relative to
 * the git root). Walks up to the nearest stamped ancestor.
 */
export function getElementSource(element: Element): ElementSource | null {
  const value = element
    .closest(`[${PATH_ATTRIBUTE}]`)
    ?.getAttribute(PATH_ATTRIBUTE)
  if (!value) return null
  const match = /^(.+?):(\d+):(\d+)(?::.*)?$/.exec(value)
  if (!match) return null
  const [, file, line, column] = match
  return { file, line: Number(line), column: Number(column) }
}

export function formatSourceLocation(source: ElementSource | null): string {
  if (!source)
    return "source unknown (is code-inspector-plugin in next.config?)"
  return `@${source.file}:${source.line}:${source.column}`
}
