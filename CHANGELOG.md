# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2020-07-29

### Added

- Document code with JSDoc comments

### Fixed

- Issue with Update on Save operating on active documents that are not markdown files

## [2.0.0] - 2020-07-29

### Added

- Update-on-save for bookmarks.

### Changed

- Changed regexes in *heading.js* to disregard spaces at the end of the line when it is an ATX closed heading.
- Renamed commands and properties in *package.json*.
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
