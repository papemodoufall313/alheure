"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import type { ContentBlock } from "@/lib/types";

/* ── Conversion ContentBlock ↔ HTML ── */

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map((b) => {
    switch (b.type) {
      case "h2":
        return `<h2>${escHtml(b.text)}</h2>`;
      case "blockquote":
        return `<blockquote><p>${escHtml(b.text)}</p>${b.cite ? `<p><em>— ${escHtml(b.cite)}</em></p>` : ""}</blockquote>`;
      case "pullquote":
        return `<blockquote><p><strong>${escHtml(b.text)}</strong></p></blockquote>`;
      default:
        return `<p>${escHtml(b.text)}</p>`;
    }
  }).join("");
}

export function htmlToBlocks(html: string): ContentBlock[] {
  if (typeof window === "undefined" || !html.trim()) return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const blocks: ContentBlock[] = [];

  for (const el of Array.from(div.children)) {
    if (el.tagName === "H2" || el.tagName === "H3") {
      const text = el.textContent?.trim() ?? "";
      if (text) blocks.push({ type: "h2", text });
    } else if (el.tagName === "BLOCKQUOTE") {
      const paras = Array.from(el.querySelectorAll("p"));
      const text = paras[0]?.textContent?.trim() ?? "";
      const citeEl = paras[1]?.querySelector("em");
      const cite = citeEl?.textContent?.replace(/^—\s*/, "").trim() ?? "";
      if (text) blocks.push({ type: "blockquote", text, ...(cite ? { cite } : {}) });
    } else if (el.tagName === "UL" || el.tagName === "OL") {
      for (const li of Array.from(el.querySelectorAll("li"))) {
        const text = `• ${li.textContent?.trim()}`;
        blocks.push({ type: "p", text });
      }
    } else {
      const text = el.textContent?.trim() ?? "";
      if (text) blocks.push({ type: "p", text });
    }
  }

  return blocks;
}

/* ── Toolbar button ── */
function Btn({ active, disabled, onClick, title, children }: {
  active?: boolean; disabled?: boolean; onClick: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      style={{
        padding: "4px 8px",
        minWidth: 32,
        border: "1px solid transparent",
        borderRadius: 3,
        background: active ? "#dbeafe" : "transparent",
        borderColor: active ? "#93c5fd" : "transparent",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? .4 : 1,
        font: "600 13px var(--sans)",
        color: active ? "var(--blue)" : "var(--ink)",
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

/* ── Separator ── */
function Sep() {
  return <div style={{ width: 1, height: 20, background: "#dde2ea", margin: "0 4px" }} />;
}

/* ── Main editor ── */
export default function RichTextEditor({ value, onChange }: {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
    ],
    content: blocksToHtml(value),
    onUpdate: ({ editor }) => {
      onChange(htmlToBlocks(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        style: [
          "min-height:280px",
          "padding:16px",
          "outline:none",
          "font:400 15px/1.75 var(--sans)",
          "color:var(--ink)",
        ].join(";"),
      },
    },
  });

  if (!editor) return null;

  return (
    <div style={{ border: "1px solid #c8d0dc", borderRadius: 3, overflow: "hidden", background: "#fff" }}>
      {/* ── Toolbar ── */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, padding: "6px 8px", borderBottom: "1px solid #dde2ea", background: "#f8f9fb" }}>
        {/* History */}
        <Btn title="Annuler" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          ↩
        </Btn>
        <Btn title="Rétablir" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          ↪
        </Btn>

        <Sep />

        {/* Inline formatting */}
        <Btn title="Gras" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </Btn>
        <Btn title="Italique" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </Btn>
        <Btn title="Souligné" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span style={{ textDecoration: "underline" }}>U</span>
        </Btn>

        <Sep />

        {/* Block types */}
        <Btn title="Titre H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <span style={{ font: "700 12px var(--sans)" }}>H2</span>
        </Btn>
        <Btn title="Titre H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <span style={{ font: "700 11px var(--sans)" }}>H3</span>
        </Btn>

        <Sep />

        <Btn title="Liste à puces" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          ≡
        </Btn>
        <Btn title="Liste numérotée" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1.
        </Btn>

        <Sep />

        <Btn title="Citation / blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <span style={{ font: "700 14px Georgia, serif" }}>&ldquo;</span>
        </Btn>

        <Sep />

        {/* Clear formatting */}
        <Btn title="Effacer la mise en forme" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
          <span style={{ fontSize: 12 }}>Tx</span>
        </Btn>
      </div>

      {/* ── Editor area ── */}
      <style>{`
        .tiptap h2 { font-family: var(--serif); font-weight: 800; font-size: 22px; font-style: italic; color: var(--blue); margin: 18px 0 6px; }
        .tiptap h3 { font-family: var(--serif); font-weight: 700; font-size: 18px; color: var(--ink); margin: 14px 0 4px; }
        .tiptap p { margin: 0 0 12px; }
        .tiptap blockquote { border-left: 3px solid var(--blue); margin: 16px 0; padding: 8px 16px; background: #f4f7ff; font-style: italic; color: var(--ink-2); }
        .tiptap ul, .tiptap ol { padding-left: 22px; margin: 0 0 12px; }
        .tiptap li { margin-bottom: 4px; }
        .tiptap strong { font-weight: 700; color: var(--ink); }
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--ink-3); pointer-events: none; float: left; height: 0; }
      `}</style>
      <EditorContent editor={editor} className="tiptap" />

      {/* ── Status bar ── */}
      <div style={{ borderTop: "1px solid #dde2ea", padding: "4px 12px", display: "flex", justifyContent: "space-between", background: "#f8f9fb" }}>
        <span style={{ font: "400 11px var(--sans)", color: "var(--ink-3)" }}>
          {editor.isActive("heading", { level: 2 }) ? "Titre H2" :
           editor.isActive("heading", { level: 3 }) ? "Titre H3" :
           editor.isActive("blockquote") ? "Citation" :
           editor.isActive("bulletList") ? "Liste" :
           "p"}
        </span>
        <span style={{ font: "400 11px var(--sans)", color: "var(--ink-3)" }}>
          {editor.storage?.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} mots
        </span>
      </div>
    </div>
  );
}
