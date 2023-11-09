import { create } from 'zustand'

type AppState = {
  extendedEditorOpen: boolean
  editingNoteId: string | null
  deletingChannelId: string | null
  leavingChannelId: string | null
  deletingNoteId: string | null
  dueDateNoteId: string | null
  noteValue: string
  notesSearchOpen: boolean
}

type AppActions = {
  setExtendedEditorOpen: (open: boolean) => void
  setEditingNoteId: (editingNoteId: AppState['editingNoteId']) => void
  setDeletingChannelId: (
    deletingChannelId: AppState['deletingChannelId']
  ) => void
  setDeletingNoteId: (deletingNoteId: AppState['deletingNoteId']) => void
  setDueDateNoteId: (deletingNoteId: AppState['dueDateNoteId']) => void
  setNoteValue: (quickNoteValue: string) => void
  setNotesSearchOpen: (notesSearchOpen: AppState['notesSearchOpen']) => void
  setLeavingChannelId: (leavingChannelId: AppState['leavingChannelId']) => void
}

export type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>((set) => ({
  extendedEditorOpen: false,
  editingNoteId: null,
  deletingChannelId: null,
  deletingNoteId: null,
  noteValue: '',
  notesSearchOpen: false,
  dueDateNoteId: null,
  leavingChannelId: null,
  setExtendedEditorOpen(open) {
    return set(() => ({ extendedEditorOpen: open }))
  },
  setEditingNoteId(editingNoteId) {
    return set(() => ({ editingNoteId }))
  },
  setDeletingChannelId(deletingChannelId) {
    return set(() => ({ deletingChannelId }))
  },
  setDeletingNoteId(deletingNoteId) {
    return set(() => ({ deletingNoteId }))
  },
  setNoteValue(noteValue) {
    return set(() => ({ noteValue }))
  },
  setNotesSearchOpen(notesSearchOpen) {
    return set(() => ({ notesSearchOpen }))
  },
  setDueDateNoteId(dueDateNoteId) {
    return set(() => ({ dueDateNoteId }))
  },
  setLeavingChannelId(leavingChannelId) {
    return set(() => ({ leavingChannelId }))
  }
}))
