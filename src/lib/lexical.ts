// Tiny builder for Lexical rich-text JSON, used by the seed content.

type Block = string | { h2: string } | { h3: string } | { ul: string[] }

const text = (value: string) => ({
  type: 'text',
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

const node = (block: Block) => {
  if (typeof block === 'string') {
    return { ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(block)] }
  }
  if ('h2' in block) return { ...base, type: 'heading', tag: 'h2', children: [text(block.h2)] }
  if ('h3' in block) return { ...base, type: 'heading', tag: 'h3', children: [text(block.h3)] }
  return {
    ...base,
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    children: block.ul.map((item, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(item)] })),
  }
}

export const richText = (...blocks: Block[]) => ({
  root: { ...base, type: 'root', children: blocks.map(node) },
})
