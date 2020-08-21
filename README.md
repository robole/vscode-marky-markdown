# Marky Markdown

![Extension file size in bytes](https://img.shields.io/static/v1?logo=visual-studio-code&label=made%20for&message=VS%20Code&color=0000ff)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/robole.marky-markdown?logo=visual-studio-code&color=ffa500)
![Extension file size in bytes](https://img.shields.io/static/v1?logo=visual-studio-code&label=size&message=20KB&color=008000)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/robole.marky-markdown?logo=visual-studio-code&color=yellow)
![Built with](https://img.shields.io/static/v1?label=built%20with&message=good%20vibrations%20%26%20javascript&color=violet)

This extension gives you rich editing powers for markdown documents, and removes irritating manual interventions you may need to make for dynamic content.

![feature banner](img/banner1280x640.png)

More features are being added to get closer to a word processor experience. 💪

Reasons to choose this extension:
1. Awesome features. 🚀
1. Small size with zero bloat: Many extensions include unnecessary files in the extension and do not optimize the resources. Expect this extension to load faster than average. ⚡
1. Loaded only when necessary: It is loaded only when you have markdown documents open. Some extensions are loaded for every project with a README, lurking in memory never to be used! 👻
1. Tested well. The extensions have test suites, it is alarming how many extensions have zero tests! ✔
1. Modular design. This is an Extension Pack, features are separated into different extensions, don't want all of the features? Then, only install the specific extensions you want! 📦📦
1. I use these extensions and actively maintain them. 🙋‍♂️

<!-- TOC -->
**Table of Contents**
- [Commands](#commands)
- [Features](#features)
	- [1) Manage a Table of Contents (TOC)](#1-manage-a-table-of-contents-toc)
	- [2) Manage Heading Bookmarks](#2-manage-heading-bookmarks)
	- [3) Manage Section Numbering](#3-manage-section-numbering)
	- [4) Document Stats](#4-document-stats)
- [Extension Settings](#extension-settings)
- [Installation](#installation)
<!-- /TOC -->

## Commands

The following commands can be run from the Command Palette (`Ctrl+Shift+P`):

1. `Marky Dynamic: Add/Update the Table of Contents (TOC)`
1. `Marky Dynamic: Remove the Table of Contents (TOC)`
1. `Marky Dynamic: Add/Update Heading Bookmarks`
1. `Marky Dynamic: Remove Heading Bookmarks`
1. `Marky Dynamic: Add/Update Section Numbering`
1. `Marky Dynamic: Remove Section Numbering`
1. `Marky Stats: Select a Statistic for the Status Bar`

## Features

### 1) Manage a Table of Contents (TOC)

The command `Marky Dynamic: Add/Update the Table of Contents (TOC)` will add a table of contents (TOC) **at the cursor position in the active markdown document**. If the TOC exists already, it will be updated.

![Add TOC](img/screenshots/add-toc.gif)

The command `Marky Dynamic: Remove the Table of Contents (TOC)` will remove the TOC.

For more information, see [Marky Dynamic](https://marketplace.visualstudio.com/items?itemName=robole.marky-dynamic).

### 2) Manage Heading Bookmarks

It is helpful to readers to have a link in headings for bookmarking different sections of a document. You probably have seen this done automatically by GitHub to `readme.md` files, like in the image below.

<img src="img/screenshots/heading-link.jpg" style="border:1px black solid;" alt="heading link" /><br>

The command `Marky Dynamic: Add/Update Heading Bookmarks` will add bookmarks to the headings in the **active markdown document**.

![add bookmark link to headings](img/screenshots/add-heading-link.gif)

By default, it will add a link with the text '**∞**', this is the infinity character, which looks like a link! In the Settings, you can customise this text (`Marky Markdown › Bookmarks: Link Text`), or specify an image (`Marky Markdown › Bookmarks: Link Image Path`). If you provide text and an image, the image will come first.

The command `Marky Dynamic: Remove Heading Bookmarks` will remove the bookmark links.

For more information, see [Marky Dynamic](https://marketplace.visualstudio.com/items?itemName=robole.marky-dynamic).

### 3) Manage Section Numbering

The command `Marky Dynamic: Add/Update Section Numbering` will add section numbers to the headings in the **active markdown document**.

The command `Marky Dynamic: Remove Section Numbering` will remove the section numbers.

For more information, see [Marky Dynamic](https://marketplace.visualstudio.com/items?itemName=robole.marky-dynamic).

### 4) Document Stats

A stat for the document is added to the status bar. By default, it is the *Reading Time*. You can choose an alternative by clicking the status bar item, and selecting from the quickpick menu.

![select stat](img/screenshots/stat-select.gif)

For more information, see [Marky Stats](https://marketplace.visualstudio.com/items?itemName=robole.marky-stats).

## Extension Settings

These settings can be applied to the User and the Workspace. The Workspace values take precedence over the User values.

| Name                                            | Type    | Enum Values          | Default | Description                                                                                                                                                                                             |
| ----------------------------------------------- | ------- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marky Markdown › Bookmarks: Level Range         | String  |                      | "2..6"  | Select the range of heading levels (from most important to least important) to which bookmarks are managed. For example, the range of '2..6' includes headings from level 2 to level 6.                 |
| Marky Markdown › Bookmarks: Link Image Path     | String  |                      | ""      | Add an image to the heading bookmark link. If both text and an image are specified, the image will come first.                                                                                          |
| Marky Markdown › Bookmarks: Link Text           | String  |                      | "∞"       | Customize the text of the heading bookmark links.                                                                                                                                                       |
| Marky Markdown › Section Numbering: Level Range         | String  |                      | "2..6"  | Select the range of heading levels (from most important to least important) for section numbers to be managed. For example, the range of '2..6' includes headings from level 2 to level 6.                 |
| Marky Markdown › Slugify Style                  | String  | "github", "gitlab" | "github"  | Creates a formatted version of the heading text that can be used as an ID, this is used as a fragment URL in links. Vendors produce slugs that are formatted differently.                               |
| Marky Markdown: Statistic Status Bar Item | String | "Reading Time", "Words", "Lines", "Characters" | "Reading Time" | Choose the statistic item that is shown in the status bar. |
| Marky Markdown › Table Of Contents: Label       | String  |                      | ""      | Add a label to the top of the Table of Contents.                                                                                                                                                        |
| Marky Markdown › Table of Contents: Level Range | String  |                      | "2..6"  | Select the range of heading levels (from most important to least important) to which are included in the Table of Contents. For example, the range of '2..6' includes headings from level 2 to level 6. |
| Marky Markdown › Table of Contents: List Type                 | String  | "unordered list", "ordered list" | "unordered list"  | The type of list for arranging the Table of Contents                               |
| Marky Markdown › Update On Save                 | Boolean |                      | false   | Update the Bookmarks, Table of Contents, and Section Numbers automatically when the document is saved.                                                                                                                    |

## Installation

1. Inside VS Code: Type `Ctrl+P`, write `ext install robole.marky-markdown` in the text field, and hit `Enter`.
1. From the Command-line: Run the command `code --install-extension robole.marky-markdown`.
1. From the [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=robole.marky-markdown): Click the _Install_ button.
