import { CheckIcon, ChevronLeftIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { MenuStep, type PanelProps } from './editor-bubble-menu'
import { type SubmitHandler, useForm } from 'react-hook-form'

type LinkForm = {
  link: string
}

export const BubbleLink = ({ editor, setMenuStep }: PanelProps) => {
  const { register, handleSubmit } = useForm<LinkForm>({
    defaultValues: {
      link: ''
    }
  })
  const onSubmit: SubmitHandler<LinkForm> = (data) => {
    editor.chain().focus().setLink({ href: data.link, target: '_blank' }).run()
    setMenuStep(MenuStep.START)
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center gap-1 p-1"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMenuStep(MenuStep.START)}
      >
        <ChevronLeftIcon size={16} />
      </Button>
      <Input placeholder="Paste a link" className="h-8" {...register('link')} />
      <Button type="submit" variant="ghost" size="sm">
        <CheckIcon size={16} />
      </Button>
    </form>
  )
}
