import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core'

export interface HashtagOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    hashtag: {
      /**
       * Set a tag mark
       */
      setHashtag: () => ReturnType,
      /**
       * Toggle a tag mark
       */
      toggleHashtag: () => ReturnType,
      /**
       * Unset a tag mark
       */
      unsetHashtag: () => ReturnType,
    }
  }
}

export const inputRegex = /(?:^|\s)((?:#)[^\s#]+)$/
export const pasteRegex = /(?:^|\s)((?:#)[^\s#]+)/g

export const Hashtag = Mark.create<HashtagOptions>({
  name: 'hashtag',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return []
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, (test) => ({ target: '_blank' })), 0]
  },

  addCommands() {
    return {
      setHashtag: () => ({ commands }) => {
        return commands.setMark(this.name)
      },
      toggleHashtag: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      },
      unsetHashtag: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-t': () => this.editor.commands.toggleHashtag(),
    }
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ]
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ]
  },
})
