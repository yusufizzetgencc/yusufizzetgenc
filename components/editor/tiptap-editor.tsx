"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Underline } from "@tiptap/extension-underline"
import { TextAlign } from "@tiptap/extension-text-align"
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"

import { 
  Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading2, Heading3,
  Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, ImageIcon, Palette
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

function Toolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append("file", file)
      
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run()
        }
      } catch (err) {
        console.error("Resim yükleme hatası", err)
      }
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL Girin:', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-muted" : ""}
        type="button"
        title="Kalın"
      >
        <Bold className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-muted" : ""}
        type="button"
        title="İtalik"
      >
        <Italic className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-muted" : ""}
        type="button"
        title="Altı Çizili"
      >
        <UnderlineIcon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-muted" : ""}
        type="button"
        title="Üstü Çizili"
      >
        <Strikethrough className="size-4" />
      </Button>
      
      <div className="mx-1 h-4 w-[1px] bg-border" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? "bg-muted" : ""}
        type="button"
      >
        <AlignLeft className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? "bg-muted" : ""}
        type="button"
      >
        <AlignCenter className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? "bg-muted" : ""}
        type="button"
      >
        <AlignRight className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={editor.isActive({ textAlign: 'justify' }) ? "bg-muted" : ""}
        type="button"
      >
        <AlignJustify className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-[1px] bg-border" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        type="button"
      >
        <Heading2 className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        type="button"
      >
        <Heading3 className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-[1px] bg-border" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
        type="button"
      >
        <List className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
        type="button"
      >
        <ListOrdered className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-muted" : ""}
        type="button"
      >
        <Quote className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "bg-muted" : ""}
        type="button"
      >
        <Code className="size-4" />
      </Button>

      <div className="mx-1 h-4 w-[1px] bg-border" />

      <Button
        variant="ghost"
        size="icon"
        onClick={setLink}
        className={editor.isActive("link") ? "bg-muted text-blue-500" : ""}
        type="button"
        title="Bağlantı Ekle"
      >
        <LinkIcon className="size-4" />
      </Button>

      <div className="relative">
        <input 
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Renk Seç"
        />
        <Button variant="ghost" size="icon" type="button">
          <Palette className="size-4" style={{ color: editor.getAttributes('textStyle').color || 'currentColor' }} />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        type="button"
        title="Resim Yükle"
      >
        <ImageIcon className="size-4" />
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp, image/gif, image/svg+xml" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={addImage}
        />
      </Button>
    </div>
  )
}

interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
}

export function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
  })

  return (
    <div className="overflow-hidden rounded-md border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
