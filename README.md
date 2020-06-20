# Marky Markdown

A funky bunch of methods for writing markdown more easily. ✍😎

![marky shaking his head](img/marky.gif)

## Commands

The following commands can be run from the Command Palette (`Ctrl+Shift+P`).

1. `Marky Markdown: Add/Update heading bookmark links`: Outlined in [1.1 Add/Update heading bookmark links](#11-addupdate-heading-bookmark-links).
2. `Marky Markdown: Remove heading bookmark links`: Outlined in [1.2. Remove heading bookmark links](#12-remove-heading-bookmark-links).

## Features

### 1. Manage bookmark links for headings

It is helpful to readers to have a link in headings for bookmarking different sections of a document. You probably have seen this done automatically by Github to `readme.md` files, like in the image below. You can add the bookmark links to a selection, or to the entire (active) document.

<img src="img/screenshots/heading-link.jpg" style="border:1px black solid;" alt="heading link" />

#### 1.1 Add/Update heading bookmark links

![add bookmark link to headings](img/screenshots/add-heading-link.gif)

By default, it will add a link with the text '**∞**', this is the infinity character, which looks like a link! In the settings, you can customise this text, or specify an image. If you provide text and an image, the image will come first.

#### 1.2. Remove heading bookmark links

Remove the bookmark link from the headings.

## Extension Settings

| Name                                 | Default  | Description                                                                                                                                                                                                 |
| ------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `markyMarkdown.headingLinkText`      | `∞`      | Customize the text of the heading bookmark link.                                                                                                                                                            |
| `markyMarkdown.headingLinkImagePath` | `""`     | Add an image to the heading bookmark link. You can specify a path relative to the markdown document, or an absolute path. If both text and an image are specified, the image will come first.               |
| `markyMarkdown.headingStartingLevel` | `2`      | Select the starting heading level to which the command actions are applied. For example, having a value of 2 applies actions to heading level 2 and beyond (3,4,5,6).                                       |
| `markyMarkdown.headingSlugifyMode`   | `github` | Slugify creates a version of the heading text that can be used as an ID, which is used as the reference in links. The options are 'github' and 'gitlab'. These vendors produce differently formatted slugs. |

## Known Issues

None.

## Feature Wishlist

1. Add/update/remove numbering to headings.
2. Add/update/remove a table of contents.
3. Update on save the bookmark links, heading numbering, and the table of contents.
4. Upload local images to an online service and replace URLs.
