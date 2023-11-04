import { Node, mergeAttributes } from '@tiptap/core'
import { PluginKey } from 'prosemirror-state'
import Suggestion from '@tiptap/suggestion'
import tippy from 'tippy.js'

const Hashtag = Node.create({
  name: 'hashtag', // you can call it anything you want.
  defaultOptions: {
    // This deafult option is used to configure the node view.
    HTMLAttributes: {},
    renderLabel: ({ node }) => `#${node.attrs.label}`, // How the node should render in the text Editor.
    suggestion: {
      // This is the suggestion object that will be used to show the suggestions.
      pluginKey: new PluginKey('hashtag'),
      char: '#' // This is the key that will be used to show the suggestions.
    }
  },
  inline: true,
  group: 'inline',
  selectable: false,
  atom: true,
  parseHTML() {
    // This is used to parse the html and convert it to the node.
    return [{ tag: "span[data-tag='hashtag']" }] // Any span tag with attribute data-tag='hashtag' will be converted to the node.
  },
  renderHTML({ node, HTMLAttributes }) {
    // This is used to render the node in the HTML (not how it would look).
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-tag': 'hashtag',
        class: 'hashtag'
      }),
      `#${node.attrs.label}`
    ]
  },
  renderText({ node }) {
    // How it would render as normal text. (There are 3 different ways to render and retrieve the data from the text editor)
    return `#${node.attrs.label}`
  },
  addKeyboardShortcuts() {
    // This is used to add keyboard shortcuts to the node.
    return {}
  },
  addProseMirrorPlugins() {
    // Responsible for registering the plugin to show the list on '#' key.
    Suggestion({
      editor: this.editor,
      items: ['one', 'two', 'three'], // can use async method to fetch list from the server.
      render: () => {
        // Going to use reactRenderer and tippy to render the suggestion box.
        let reactRenderer, popup
        return {
          onStart: (props) => {
            popup = tippy('#editor-box', {
              // Option to configure tippy box.
              getReferenceClientRect: props.getReferenceClientRect,
              content: reactRenderer.element,
              placement: 'bottom-start',
              trigger: 'manual',
              interactive: true
            })
          },
          onUpdate: () => {},
          onExit: () => {
            reactRenderer.destory()
          }
        }
      }
    })
  }
})
