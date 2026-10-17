# Blog authoring guide

How to write and upload an article through the Writer Portal (`/team-portal`) or the admin dashboard. The editor has a **Guide** button with a short version of this page, and a **Preview** tab that renders the article exactly as it will appear on the site.

## Article fields

| Field | Required | Notes |
|---|---|---|
| Title | Yes | Shown as the page heading. |
| Excerpt | Yes | Shown on the blog index; used as the search description if no SEO description is set. |
| Body | Yes | Markdown, see below. Up to 200,000 characters. |
| Cover image | No | Recommended 1200 × 630 px. |
| Images | No | Up to 20 per article, see [Images](#images). |
| References | No | Numbered and cited in the text as `[1]`. |
| Further reading | No | Unnumbered background material that isn't cited. |
| Co-authors | No | Up to 10. The signed-in writer is always the lead author. |
| SEO title | No | 70 characters max. Used exactly as written in the browser tab and search results. If left blank, the site uses the article title followed by " \| QNexus — Quantum Nexus Global". |
| SEO description | No | 160 characters max. If left blank, the site uses the excerpt. |

## Text formatting

| You write | You get |
|---|---|
| `**bold text**` | **bold text** |
| `*italic text*` | *italic text* |
| `***bold italic text***` | ***bold italic text*** |
| `` `inline code` `` | `inline code` |
| `[link text](https://example.org)` | External link. Opens in a new tab. |
| `> quoted text` | Block quote |
| `---` on its own line | Horizontal rule |
| `~~struck~~` | Strikethrough |

**Lists:** start lines with `- ` for bullets or `1. ` for numbers. Indent by 2–4 spaces to nest.

**Code blocks:** put three backticks and an optional language name on the line before the code, and three backticks on the line after:

````
```python
from qiskit import QuantumCircuit
```
````

**Tables:** pipe tables, with a separator row under the header:

```
| Qubits | Fidelity |
|---|---|
| 5 | 99.1% |
```

**Footnotes:** `text[^note]` and later `[^note]: The footnote.` These are for asides. Use [References](#references-and-citations) for sources.

## Headings and the `#` character

- `# Heading`, `## Subheading`, `### Sub-subheading` (down to `######`). The `#` must be at the **start of a line** and **followed by a space**.
- `#` in the body becomes the article's top section level. The article title stays the only top-level heading on the page.
- A `#` anywhere else is plain text and needs no escaping: `#hashtag`, `C#`, `issue #42`.
- To start a line with a literal `# ` that isn't a heading, escape it: `\# 1 priority`.

**Section anchors.** Every heading gets an anchor generated from its text: `## Error Mitigation` becomes `#error-mitigation`. If the heading text changes, the anchor changes too. To pin it, add `{#id}` at the end of the heading:

```
## Error Mitigation Results {#results}
```

The heading then shows "Error Mitigation Results" and always links as `#results`.

**Linking within the article:** `[see the results](#results)`. Articles with three or more sections get an automatic "On this page" table of contents.

## Equations

The site renders LaTeX with **KaTeX**. MathJax isn't used.

- Inline: `$E = mc^2$`
- Display (centred, on its own lines):

  ```
  $$
  \hat{H}\lvert\psi\rangle = E\lvert\psi\rangle
  $$
  ```

- For a literal dollar sign, write `\$`. For example, `costs \$5`. Two unescaped `$` signs on one line are read as an equation.
- KaTeX supports most of LaTeX math mode, but not every package. If an expression can't be rendered, it is shown in red in the Preview instead of breaking the page. Supported commands: https://katex.org/docs/supported.html

## Images

**Formats:** JPEG, PNG, WebP, AVIF, GIF. SVG isn't accepted because SVG files can contain scripts.

**Size:**

| | Limit |
|---|---|
| File size | 5 MB per image (1 MB if the server has no Cloudinary account configured) |
| Width | At least 600 px |
| Maximum | 6000 px on either side |
| Recommended | 1600 px wide for in-article images; 1200 × 630 px for the cover |
| Per article | 20 images |

The upload checks the file's actual contents, not its extension.

**Adding and placing images**

1. In the Images section, click **Upload images** (you can select several files) or paste an `https://` image URL.
2. Each image gets a marker such as `[[image:img-k3x9qa]]`. Put the cursor in the body where the image should go and click **Insert at cursor**. The marker must be on its own line, with a blank line before and after.
3. Use the ↑/↓ buttons to reorder. Figures are numbered (Figure 1, Figure 2, …) in the order they appear in the text. Images you haven't placed are shown after the article body, in list order.

**Per-image fields**

| Field | Required | Shown as |
|---|---|---|
| Alt text | Yes | Read by screen readers and shown if the image fails to load. Describe what the image shows. |
| Caption | No | "Figure N. Caption" under the image. |
| Creator | No | "Image: Name" |
| Source + Source URL | No | "Source: Name" (linked if a URL is given) |
| License + License URL | No | "License: CC BY 4.0" (linked if a URL is given) |

Credit fields you leave empty are hidden, so nothing like "Source: —" appears.

**Standard Markdown images** (`![alt](https://…)`) also work, but they get no caption, credit or figure number. Use the Images section for anything that needs attribution.

## References and citations

1. Add each source in the **References** section: title (required), authors, publisher/journal/website, year, URL and/or DOI. A DOI can be pasted as `10.1234/abcd` or as a full `https://doi.org/...` link.
2. Cite sources in the body by number: `[1]`, `[1, 3]`, `[2-4]`. The **Cite [n]** button inserts the marker at the cursor.
3. On the published page:
   - each citation is a link that jumps to its entry in the References list;
   - each reference has a **↩ Back to citation** link. If a source is cited several times, the links are labelled a, b, c, ….
   - DOI and URL links open in a new tab, with `rel="noopener noreferrer"`.
4. References are numbered in the order they appear in the list. Reordering the list renumbers them, so update the citations in the body to match.
5. Put background sources you don't cite in **Further reading**. They're shown separately, without numbers, and labelled as not cited.

Things to know:

- A number in square brackets in normal text, like `[2]`, becomes a citation if reference 2 exists. Numbers in brackets inside code (`` `x[2]` ``) and links are left alone. Numbers that don't match a reference stay as plain text, and the editor warns about them.
- Don't write `[1]: https://…` at the start of a line. Markdown treats that line as a hidden link definition, so it disappears from the article. Use the References section instead.

The editor also warns about images with no alt text, images you haven't placed, image markers that don't match any image, and references that are never cited.

## HTML and safety

Markdown is the supported format. A small set of inline HTML is allowed where Markdown has no equivalent:

`<sup>`, `<sub>`, `<mark>`, `<kbd>`, `<abbr title="…">`, `<br>`, `<details>` / `<summary>`, `<ins>`, `<del>`, `<s>`, `<q>`, `<cite>`, `<dfn>`, `<small>`, `<var>`, `<samp>`, and the HTML forms of the Markdown elements above (`<strong>`, `<em>`, `<a href>`, `<table>`, …).

Everything else is removed when the page is rendered, including:

- `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>` (except task-list checkboxes)
- event attributes such as `onclick` and `onerror`, and `style` attributes
- `javascript:` and `data:` links. Only `http:`, `https:`, `mailto:` and in-page `#` links are kept.

The body is stored exactly as you typed it. Sanitising happens when the page is displayed, so equations, `<` / `>` inside math or code, backslashes, `$`, `#`, and all Unicode characters (Greek letters, ⟨bra|ket⟩ notation, emoji, non-Latin scripts) are preserved. The only changes on save are:

- Windows line endings are converted to `\n`;
- invisible control characters are removed;
- text is normalised to Unicode NFC, so that characters that look identical are stored identically.

Image, source, licence and reference URLs must be `http(s)://`. Other URLs are rejected when you save, and you'll see an error message.
