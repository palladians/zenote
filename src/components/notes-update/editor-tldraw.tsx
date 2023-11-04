import { Node, type NodeViewProps, mergeAttributes } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { Tldraw, track, createTLStore, defaultShapeUtils } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import { debounce } from 'throttle-debounce'
import { AspectRatio } from '@/components/ui/aspect-ratio'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tldraw: {
      addDrawing: () => ReturnType
    }
  }
}

const DrawingComponent = track(({ updateAttributes, node }: NodeViewProps) => {
  const [restored, setRestored] = useState(false)
  const [store] = useState(() =>
    createTLStore({ shapeUtils: defaultShapeUtils })
  )
  const onCanvasUpdate = () => {
    const snapshot = store.getSnapshot()
    updateAttributes({
      state: JSON.stringify(snapshot)
    })
  }
  const debouncedCanvasUpdate = debounce(1000, onCanvasUpdate)
  useEffect(() => {
    if (!store) return
    store.listen(debouncedCanvasUpdate)
  }, [store])
  useEffect(() => {
    if (restored) return
    const stringifiedSnapshot = node.attrs.state
    if (!stringifiedSnapshot) return
    const snapshot =
      stringifiedSnapshot?.length > 0 && JSON.parse(stringifiedSnapshot)
    if (!snapshot) return
    store.loadSnapshot(snapshot)
    setRestored(true)
  }, [node.attrs])
  return (
    <NodeViewWrapper data-drawing>
      <AspectRatio ratio={2}>
        <Tldraw inferDarkMode store={store} />
      </AspectRatio>
    </NodeViewWrapper>
  )
})

export const EditorTldraw = Node.create({
  name: 'tldraw',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      state: {
        default: {}
      }
    }
  },

  addCommands() {
    return {
      addDrawing:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name
          })
        }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-drawing]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-drawing': '' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawingComponent)
  }
})
