import * as React from "react"

/** The content of a key that sinks, wrapped so it can ride the face down
    (`.neu-press-label`). With asChild the label goes inside the slotted
    child, around that child's own content. */
function withPressLabel(
  children: React.ReactNode,
  asChild = false
): React.ReactNode {
  if (!asChild) {
    return (
      <span data-slot="press-label" className="neu-press-label">
        {children}
      </span>
    )
  }
  if (
    !React.isValidElement<{ children?: React.ReactNode }>(children) ||
    children.props.children == null
  ) {
    return children
  }
  return React.cloneElement(
    children,
    undefined,
    withPressLabel(children.props.children)
  )
}

export { withPressLabel }
