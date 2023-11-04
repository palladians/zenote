import { LinkIcon } from "lucide-react"
import { Button } from "../ui/button"
import { MenuStep, PanelProps } from "./editor-bubble-menu"

export const BubbleStart = ({ editor, setMenuStep }: PanelProps) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="icon"
        className="font-bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="icon"
        className="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Button>
      <Button
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        size="icon"
        className="line-through"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </Button>
      <Button
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setMenuStep(MenuStep.LINK)}
      >
        <LinkIcon size={16} />
      </Button>
      <Button
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        Code
      </Button>
      <Button
        variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Block
      </Button>
      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        ·
      </Button>
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </Button>
      <Button
        variant="ghost"
        onClick={() => setMenuStep(MenuStep.AI)}
      >
        AI
      </Button>
    </div>
  )
}
