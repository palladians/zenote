'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format, set } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { useAppStore } from '@/store/app'
import React from 'react'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { api } from '@/trpc/react'

export type NoteDueDateDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

type DueDateForm = {
  date: Date
  time: string
}

export const NoteDueDateDialog = () => {
  const dueDateNoteId = useAppStore((state) => state.dueDateNoteId)
  const { data: note } = api.notes.get.useQuery({ id: dueDateNoteId ?? '' })
  const { mutateAsync: updateNote } = api.notes.update.useMutation()
  const setDueDateNoteId = useAppStore((state) => state.setDueDateNoteId)
  const { register, watch, handleSubmit, setValue } = useForm<DueDateForm>({
    defaultValues: {
      date: undefined,
      time: ''
    }
  })
  const onSubmit: SubmitHandler<DueDateForm> = async (data) => {
    if (!note) return
    const [hours, minutes] = data.time.split(':')
    const dueDate = set(data.date, {hours: parseInt(hours ?? '0'), minutes: parseInt(minutes ?? '0')})
    await updateNote({
      ...note,
      dueDate
    })
    setDueDateNoteId(null)
  }
  const date = watch('date')
  return (
    <Dialog open={!!dueDateNoteId} onOpenChange={() => setDueDateNoteId(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set note due date</DialogTitle>
        </DialogHeader>
        <form
          id="dueDateForm"
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label>Due Date</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'flex-[2] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(value) => value && setValue('date', value)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input type="time" className="flex-1" {...register('time')} />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" form="dueDateForm">
            Set Due Date
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
