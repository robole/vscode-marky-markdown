# Marky Markdown

![Extension file size in bytes](https://img.shields.io/static/v1?logo=visual-studio-code&label=made%20for&message=VS%20Code&color=0000ff)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/robole.marky-markdown?logo=visual-studio-code&color=ffa500)
![Extension file size in bytes](https://img.shields.io/static/v1?logo=visual-studio-code&label=size&message=65KB&color=008000)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/robole.marky-markdown?logo=visual-studio-code&color=yellow)
![GitHub last commit](https://img.shields.io/github/last-commit/robole/vscode-marky-markdown?color=4b0082)
![Built with](https://img.shields.io/static/v1?label=built%20with&message=good%20vibrations%20%26%20javascript&color=violet)

A funky bunch of methods for writing markdown more easily. ✍😎

![marky shaking his head](img/marky.gif)

<!-- TOC -->
**Table of Contents**
- [Commands](#commands)
- [Features](#features)
	- [(1) Manage a Table of Contents (TOC)](#1-manage-a-table-of-contents-toc)
	- [(2) Manage Heading Bookmarks](#2-manage-heading-bookmarks)
	- [(3) Manage Section Numbering](#3-manage-section-numbering)
- [Extension Settings](#extension-settings)
- [Installation](#installation)
- [Known Issues](#known-issues)
- [Feature Wishlist](#feature-wishlist)
<!-- /TOC -->

## Commands

The following commands can be run from the Command Palette (`Ctrl+Shift+P`):

1. `Marky Markdown: Add/Update the Table of Contents (TOC)`
1. `Marky Markdown: Remove the Table of Contents (TOC)`
1. `Marky Markdown: Add/Update Heading Bookmarks`
1. `Marky Markdown: Remove Heading Bookmarks`
1. `Marky Markdown: Add/Update Section Numbering`
1. `Marky Markdown: Remove Section Numbering`

## Features

### (1) Manage a Table of Contents (TOC)

The command `Marky Markdown: Add/Update the Table of Contents (TOC)` will add a table of contents (TOC) **at the cursor position in the active markdown document**. If the TOC exists already, it will be updated.

![Add TOC](img/screenshots/add-toc.gif)

It does the following:

- Searches for open and closed ATX-style headings (the ones that use hashes).
- **Includes headings levels 2 through 6 by default.** You can change this in the Settings through the `Marky Markdown › Bookmarks: Level Range` option.
- It creates a link with the URL based on the setting `Marky Markdown › Slugify Style`. It excludes the text from bookmark links.
- It creates an unordered list of the links. Indentation is based on your User Settings (`Editor: Insert Spaces`, `Editor: Tab Size`, and `Editor: Detect Indentation` )
- It adds a CodeLens entry to the top of the TOC indicating if it is "up-to-date" with the document. You can click this entry to update the TOC.

  	![Update TOC](img/screenshots/update-toc.gif)

- You can choose to have the TOC update automatically whenever the document is saved by enabling the `Marky Markdown › Update On Save` option in the Settings. The performance is good, it will not be an issue if you have [Autosave](https://code.visualstudio.com/docs/editor/codebasics#_save-auto-save) set to save "after a delay" of approximately 1 second, but you should be mindful of what other extensions are up to!
- You can choose to add a label to the top of the TOC by editing the `Marky Markdown › Table Of Contents: Label` option in the Settings.

The command `Marky Markdown: Remove the Table of Contents (TOC)` will remove the TOC.

### (2) Manage Heading Bookmarks

It is helpful to readers to have a link in headings for bookmarking different sections of a document. You probably have seen this done automatically by GitHub to `readme.md` files, like in the image below.

<img src="img/screenshots/heading-link.jpg" style="border:1px black solid;" alt="heading link" /><br>

The command `Marky Markdown: Add/Update Heading Bookmarks` will add bookmark links to the headings in the **active markdown document**.

![add bookmark link to headings](img/screenshots/add-heading-link.gif)

It does the following:

- Searches for open and closed ATX-style headings (the ones that use hashes).
- **Includes headings levels 2 through 6 by default.** You can change this in the Settings through the `Marky Markdown › Table of Contents: Level Range` option.
- By default, it will add a link with the text '**∞**', this is the infinity character, which looks like a link! In the Settings, you can customise this text (`Marky Markdown › Bookmarks: Link Text`), or specify an image (`Marky Markdown › Bookmarks: Link Image Path`). If you provide text and an image, the image will come first.
- The URL generated is based on the setting `Marky Markdown › Slugify Style`. It excludes the text from bookmark links.
- You can choose to have the bookmarks update automatically whenever the document is saved by enabling the `Marky Markdown › Update On Save` option in the Settings.

The command `Marky Markdown: Remove Heading Bookmarks` will remove the bookmark links.

### (3) Manage Section Numbering

The command `Marky Markdown: Add/Update Section Numbering` will add section numbers to the headings in the **active markdown document**.

It does the following:

- Searches for open and closed ATX-style headings (the ones that use hashes).
- **Includes headings levels 2 through 6 by default.** You can change this in the Settings through the `Marky Markdown › Section Numbering: Level Range` option.

The command `Marky Markdown: Remove Section Numbering` will remove the section numbers.

## Extension Settings

These settings can be applied to the User and the Workspace. The Workspace values take precedence over the User values.

| Name                                            | Type    | Enum Values          | Default | Description                                                                                                                                                                                             |
| ----------------------------------------------- | ------- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marky Markdown › Bookmarks: Level Range         | String  |                      | "2..6"  | Select the range of heading levels (from most important to least important) to which bookmarks are managed. For example, the range of '2..6' includes headings from level 2 to level 6.                 |
| Marky Markdown › Bookmarks: Link Image Path     | String  |                      | ""      | Add an image to the heading bookmark link. If both text and an image are specified, the image will come first.                                                                                          |
| Marky Markdown › Bookmarks: Link Text           | String  |                      | ∞       | Customize the text of the heading bookmark links.                                                                                                                                                       |
| Marky Markdown › Section Numbering: Level Range         | String  |                      | "2..6"  | Select the range of heading levels (from most important to least important) for section numbers to be managed. For example, the range of '2..6' includes headings from level 2 to level 6.                 |
| Marky Markdown › Slugify Style                  | String  | ['github', 'gitlab'] | github  | Creates a formatted version of the heading text that can be used as an ID, this is used as a fragment URL in links. Vendors produce slugs that are formatted differently.                               |
| Marky Markdown › Table Of Contents: Label       | String  |                      | ""      | Add a label to the top of the Table of Contents.                                                                                                                                                        |
| Marky Markdown › Table of Contents: Level Range | String  |                      | "2..6"  | Select the range of heading levels (from most important to least important) to which are included in the Table of Contents. For example, the range of '2..6' includes headings from level 2 to level 6. |
| Marky Markdown › Update On Save                 | Boolean |                      | false   | Update the Bookmarks and Table of Contents automatically when the document is saved.                                                                                                                    |

## Installation

1. Inside VS Code: Type `Ctrl+P`, write `ext install robole.marky-markdown` in the text field, and hit `Enter`.
1. From the Command-line: Run the command `code --install-extension robole.marky-markdown`.
1. From the [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=robole.marky-markdown): Click the _Install_ button.

## Known Issues

None.

## Feature Wishlist

1. Include section numbering in Update on Save.
1. Include link text and image text path in regex to avoid false positives for bookmarks being added to document.
1. Option to choose ordered list for TOC.
1. Add support for other languages.
