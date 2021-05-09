<h1 align="center">
  <br>
    <img align="center" src="img/logo.png" width="200">
  <br>
	<br>
  Marky Markdown
  <br>
  <br>
</h1>
<h4 align="center">Markdown editing. Redefined.</h4>

<p align="center">
<img src="https://img.shields.io/static/v1?logo=visual-studio-code&label=made%20for&message=VS%20Code&color=0000ff" alt="Made for VSCode">
<img src="https://img.shields.io/visual-studio-marketplace/v/robole.marky-markdown?logo=visual-studio-code&color=ffa500" alt="Visual Studio Marketplace Version">
<img src="https://img.shields.io/static/v1?logo=visual-studio-code&label=size&message=12KB&color=008000"
alt="Extension file size in bytes">
<img src="https://img.shields.io/visual-studio-marketplace/r/robole.marky-markdown?logo=visual-studio-code&color=yellow" alt="Visual Studio Marketplace Rating">
<img src="https://img.shields.io/visual-studio-marketplace/d/robole.marky-markdown?logo=visual-studio-code&color=blue" alt="downloads"/>
<img src="https://img.shields.io/visual-studio-marketplace/i/robole.marky-markdown?logo=visual-studio-code&color=blue" alt="installs"/>
<img src="https://img.shields.io/static/v1?label=built%20with&message=good%20vibrations%20%26%20javascript&color=violet" alt="Built with carrot juice and javascript"/>
<a href="https://ko-fi.com/roboleary"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-$4-orange?logo=buy-me-a-coffee" alt="Buy me a coffee"></a>
</p>

This is an extension pack for a collection of related markdown extensions I wrote. 

The advantage that this extension pack has over an extension such as [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) is that you can disable features you don't use, or don't want by disabling an extension. You can go a step further and choose to only install the extensions you use.

## Extensions

1. [Marky Edit](https://marketplace.visualstudio.com/items?itemName=robole.marky-edit): Toggle-style editing.
1. [Marky Dynamic](https://marketplace.visualstudio.com/items?itemName=robole.marky-dynamic): Automate updating dynamic content such as Table of Contents.
1. [Markdown Snippets](https://marketplace.visualstudio.com/items?itemName=robole.markdown-snippets): Snippets for extended markdown syntax.
1. [Marky Stats](https://marketplace.visualstudio.com/items?itemName=robole.marky-markdown): Add stats to the status bar.

## Activation

These extensions are only loaded when a markdown file is open. To be more specific, the [activation event](https://code.visualstudio.com/api/references/activation-events) is `onLanguage: markdown`.

## Commands

The following commands can be run from the Command Palette (`Ctrl+Shift+P`):
1. `Marky Edit: Toggle Delete (Strikethrough)`
1. `Marky Edit: Toggle Emphasis (Italic)`
1. `Marky Edit: Toggle Fenced Code Block`
1. `Marky Edit: Toggle Heading 1`
1. `Marky Edit: Toggle Heading 2`
1. `Marky Edit: Toggle Heading 3`
1. `Marky Edit: Toggle Heading 4`
1. `Marky Edit: Toggle Heading 5`
1. `Marky Edit: Toggle Heading 6`
1. `Marky Edit: Toggle Horizontal Rule`
1. `Marky Edit: Toggle Image`
1. `Marky Edit: Toggle Inline Code`
1. `Marky Edit: Toggle Link`
1. `Marky Edit: Toggle Ordered List (Bulleted List)`
1. `Marky Edit: Toggle Quote`
1. `Marky Edit: Toggle Strong Emphasis (Bold)`
1. `Marky Edit: Toggle Unordered List (Numbered List)`
1. `Marky Dynamic: Add/Update the Table of Contents (TOC)`
1. `Marky Dynamic: Remove the Table of Contents (TOC)`
1. `Marky Dynamic: Add/Update Heading Bookmarks`
1. `Marky Dynamic: Remove Heading Bookmarks`
1. `Marky Dynamic: Add/Update Section Numbering`
1. `Marky Dynamic: Remove Section Numbering`
1. `Marky Stats: Select Stat`

See individual extensions for up-to-date list.

## Major Features Overview

### 1) Toggle-style editing

![toggle editing](img/screenshots/toggleStrong.gif)

For more information, see [Marky Edit](https://marketplace.visualstudio.com/items?itemName=robole.marky-edit).

### 2) Manage a Table of Contents (TOC)

The command `Marky Dynamic: Add/Update the Table of Contents (TOC)` will add a table of contents (TOC) **at the cursor position in the active markdown document**. If the TOC exists already, it will be updated.

![Add TOC](img/screenshots/add-toc.gif)

The command `Marky Dynamic: Remove the Table of Contents (TOC)` will remove the TOC.

For more information, see [Marky Dynamic](https://marketplace.visualstudio.com/items?itemName=robole.marky-dynamic).

### 3) Manage Section Numbering

The command `Marky Dynamic: Add/Update Section Numbering` will add section numbers to the headings in the active markdown document.

The command `Marky Dynamic: Remove Section Numbering` will remove the section numbers.

For more information, see [Marky Dynamic](https://marketplace.visualstudio.com/items?itemName=robole.marky-dynamic).

### 4) Markdown Snippets

![table snippet](img/screenshots/table.gif)

I recommend installing the [Snippets Ranger](https://marketplace.visualstudio.com/items?itemName=robole.snippets-ranger) extension to give you an easy to view and edit of all of the snippets available.

For more information, see [Markdown Snippets](https://marketplace.visualstudio.com/items?itemName=robole.markdown-snippets).

### 5) Document Stats

A stat for the document is added to the status bar. By default, it is the *Reading Time*.

![select stat](img/screenshots/stat-select.gif)

You can choose an alternative stat by clicking the status bar item, and selecting from the quickpick menu.

For more information, see [Marky Stats](https://marketplace.visualstudio.com/items?itemName=robole.marky-markdown).

## Extension Settings

You will find options for these extensions by searching for "marky".

## Installation

1. The extension is listed in the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=robole.marky-markdown) and [Open VSX Marketplace](https://open-vsx.org/extension/robole/marky-stats) where you can download or install it directly.
1. Inside VS Code: Type `Ctrl+P`, write `ext install robole.marky-markdown` in the text field, and hit `Enter`.
1. From the Command-line: Run the command `code --install-extension robole.marky-markdown`.

## Show gratitude

If you are happy with the extension, please star the repo, and leave a review to help others find it. 🌟

You can [buy me a coffee](https://ko-fi.com/roboleary) if you would like to support me in my quest to make more great open-source software. ☕🙏
