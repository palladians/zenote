import { type Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/react'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { match } from 'ts-pattern'
import { BubbleAi } from './bubble-ai'
import { BubbleStart } from './bubble-start'
import { BubbleLink } from './bubble-link'

export enum MenuStep {
  START = 'START',
  AI = 'AI',
  LINK = 'LINK'
}

export type PanelProps = {
  editor: Editor
  menuStep: MenuStep
  setMenuStep: (menuStep: MenuStep) => void
}

export const EditorBubbleMenu = ({ editor }: { editor: Editor }) => {
  const [menuStep, setMenuStep] = useState<MenuStep>(MenuStep.START)

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        maxWidth: '420px',
        onHide: () => setMenuStep(MenuStep.START)
      }}
    >
      <Card className="flex flex-col items-center justify-center shadow-2xl">
        {match(menuStep)
          .with(MenuStep.START, () => (
            <BubbleStart
              editor={editor}
              menuStep={menuStep}
              setMenuStep={setMenuStep}
            />
          ))
          .with(MenuStep.AI, () => (
            <BubbleAi
              editor={editor}
              menuStep={menuStep}
              setMenuStep={setMenuStep}
            />
          ))
          .with(MenuStep.LINK, () => (
            <BubbleLink
              editor={editor}
              menuStep={menuStep}
              setMenuStep={setMenuStep}
            />
          ))
          .otherwise(() => null)}
      </Card>
    </BubbleMenu>
  )
}
