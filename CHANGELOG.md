# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.10.0] - 2021-05-12

### Changed

- Updated GIF for Marky Stats.

### Fixed

- Links to Marky Stats were incorrect.

### Removed

- Removed unused images.

## [2.9.0] - 2021-05-12

### Changed

- Sharpen up README.

## [2.8.1] - 2021-05-09

### Changed

- Changed clunky copy in README.

## [2.8.0] - 2021-05-09

### Changed

- Update README.md format
- Added github action to publish to marketplaces.

## [2.7.0] - 2020-09-09

### Added

- Added extensions:`robole.marky-edit` and `robole.markdown-snippets`.

### Changed

- Edited README.md to include details of new extensions
- Changed version for VS Code engine to 1.0.0 to support more VS Code versions.

## [2.6.0] - 2020-08-20

### Changed

- Change extension to be an extension pack for 2 extensions (Marky Dynamic and Marky Stats), which have the same features. So, now users can pick or choose features with separate installations if they prefer.

### Removed

- Remove redundant code.

## [2.5.1] - 2020-08-14

### Changed

- Tweak logo and banner background colour in `package.json`.
- Added "reason to chose this extensions over others" to `README.md`.

## [2.5.0] - 2020-08-14

### Changed

- New logo

## [2.4.1] - 2020-08-12

### Fixed

- When changing the statistic for the status bar, it was not updating instantly. Made `save()` in `statistic.js` *async*.

## [2.4.0] - 2020-08-11

### Added

- Added `getReadingTime()` to `document.js` and related test in `document.test.js`.
- Added `marky-markdown.selectStatisticItem` to `package.json` to choose stat to display.

### Changed

- Description for `Update on Save` to include section numbers.
- Changed `getWordCount()` to return zero for empty string.
- Changed `statistics.js` to save selection of the stat item to the workspace configuration.
- Moved module exports to the end of all files in *src/*.

## [2.3.0] - 2020-08-09

### Added

- Added stat in the status bar.
- The command `Marky Markdown: Select Statistic to Show in Status Bar`.
- Added screenshot for selecting stats.

### Changed

- Improved blurb in README.md (I can do better 💪)!
- Section for stats in README.md.

## [2.2.0] - 2020-08-08

### Added

- Update on Save for Section Numbering.
- Option to choose the list type for Table of Contents.

### Changed

- Gave default values to some parameters and removed any default setting in function bodies.
- Improved blurb in README.md.

## [2.1.0] - 2020-08-03

### Added

- Command: `Marky Markdown: Add/Update Section Numbering`.
- Command: `Marky Markdown: Remove Section Numbering`.
- Custom ESLint config.
- Badges to README.md

### Changed

- Changed the basis of a tab to the following settings for the active editor: `Editor: Insert Spaces`, and `Editor: Detect Indentation`, and `Editor: Tab Size`.
- Refactored code based on new ESLint config.
- Updated _.vscodeignore_ to ignore all images except the icon and ignore README.md, which reduced the size of the extension from 750KB to 65KB.

## [2.0.1] - 2020-07-29

### Added

- Document code with JSDoc comments.

### Fixed

- Issue with Update on Save operating on active documents that are not markdown files.

## [2.0.0] - 2020-07-29

### Added

- Update-on-save for bookmarks.

### Changed

- Changed regexes in _heading.js_ to disregard spaces at the end of the line when it is an ATX closed heading.
- Renamed commands and properties in _package.json_.
- Refactored code to simplify and separate active editor logic into module.
- Removed unnecessary options in webpack.config.js.

## [1.1.0] - 2020-07-28

These efforts reduced size of packaged _.vsix_ from 1.33MB to 775KB.

### Added

- Webpack configuration to bundle into extension into dist/extension.js

### Changed

- Updated _.vscodeignore_ to exclude the _src_ folder, and some images.
- Optimized _marky.gif_.
- Added new scripts to _package.json_ to manage bundling and publishing.

## [1.0.0] - 2020-07-23

### Added

- Command: `Marky Markdown: Add/Update the Table of Contents (TOC)`.
- Command: `Marky Markdown: Remove the Table of Contents (TOC)`.

### Changed

- Configuration properties were all renamed in `package.json` and refactored in code.
- Changed README.md sections and added table of contents.

## [0.0.1] - 2020-07-05

### Added

- Initial release. Included Feature 1 "Manage Heading Bookmark Links".
