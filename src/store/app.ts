import { create } from "zustand";

type AppState = {
  extendedEditorOpen: boolean
  editingNoteId: string | null
  deletingChannelId: string | null
  deletingNoteId: string | null
  quickNoteValue: string
}

type AppActions = {
  setExtendedEditorOpen: (open: boolean) => void
  setEditingNoteId: (editingNoteId: AppState['editingNoteId']) => void
  setDeletingChannelId: (deletingChannelId: AppState['deletingChannelId']) => void
  setDeletingNoteId: (deletingNoteId: AppState['deletingNoteId']) => void
  setQuickNoteValue: (quickNoteValue: string) => void
}

export type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>((set) => ({
  extendedEditorOpen: false,
  editingNoteId: null,
  deletingChannelId: null,
  deletingNoteId: null,
  quickNoteValue: '',
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
  setQuickNoteValue(quickNoteValue) {
    return set(() => ({ quickNoteValue }))
  }
}))
