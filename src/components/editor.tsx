'use client'

import './editor.css'
import { EditorContent, FloatingMenu, BubbleMenu, useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import StarterKit from '@tiptap/starter-kit';
import { Card } from './ui/card'
import { Button } from './ui/button'

export const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography
    ],
    content: ''
  })
  if (!editor) return null
  return (
    <>
      {editor && <BubbleMenu editor={editor}>
        <Card className="flex p-2 gap-2">
          <Button variant={editor.isActive('bold') ? 'default' : 'secondary'} size="icon" className="font-bold" onClick={() => editor.chain().focus().toggleBold().run()}>B</Button>
          <Button variant={editor.isActive('italic') ? 'default' : 'secondary'} size="icon" className="italic" onClick={() => editor.chain().focus().toggleItalic().run()}>I</Button>
          <Button variant={editor.isActive('strike') ? 'default' : 'secondary'} size="icon" className="line-through" onClick={() => editor.chain().focus().toggleStrike().run()}>S</Button>
        </Card>
      </BubbleMenu>}
      {editor && <FloatingMenu editor={editor}>XD</FloatingMenu>}
      <EditorContent editor={editor} className="flex-1 border rounded-lg overflow-hidden bg-zinc-900" />
    </>
  )
}
