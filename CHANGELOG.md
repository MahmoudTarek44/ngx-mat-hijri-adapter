# Changelog

All notable changes to ngx-mat-hijri-adapter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-10-10

### Native adapter and agent instructions

This patch is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. `provideHijriDateAdapter()` still stores a `CalendarDate`. A second provider stores a JavaScript `Date` when a form needs one. The agent skill page no longer assumes one editor.

#### Changes by Commit

| Commit    | Type       | Description                                                                                                                |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `c9f15fb` | ✨ Feature | **Native adapter**: `provideNativeHijriDateAdapter()` from `ngx-mat-hijri-adapter/native` stores a `Date` at UTC noon      |
| `7d2230a` | 📝 Docs    | **AI agents**: Copy the shipped skill to `AGENTS.md`, so any coding agent can follow it                                   |

### 📝 Summary of Changes

#### ✨ Added

- **Native Hijri adapter**: `provideNativeHijriDateAdapter()` registers a `DateAdapter<Date>`. `Intl` formats and parses the day with `islamic-umalqura` or `gregory`. An in-repo Umm al-Qura table does the day math for AH 1300–1599. Each value is stored at UTC noon, so a time zone cannot move the civil day. `createDate(1445, 8, 1)` is 1 Ramadan 1445, which is 11 March 2024 at 12:00 UTC
- **Docs examples**: The date adapter page shows both providers. The home page runs a native Umm al-Qura datepicker and a native Gregorian datepicker. The API reference lists the `/native` entry
- **Roadmap**: The native adapter is listed under Implemented. `calendarOf()` and custom calendar-toggle templates are under development. A package MCP server is an unscheduled idea

#### 🔧 Changed

- **AI agents**: After `ng add`, copy `agents/SKILL.md` to `AGENTS.md` at the project root. If that file already exists, add the skill to it. A skills folder is only an example for agents that load `SKILL.md` themselves
- **Default value**: The README states that the default adapter stores `CalendarDate`, and that `/native` stores a `Date` at UTC noon

### 📦 Modified Files

<details>
<summary><strong>Library</strong></summary>

- `projects/ngx-mat-hijri-adapter/native/` - `NativeHijriDateAdapter`, `provideNativeHijriDateAdapter()`, and the Umm al-Qura month-length table
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-constants.ts` - Shared calendar codes and the AH 1300–1599 limits, with no `@internationalized/date` import
- `projects/ngx-mat-hijri-adapter/agents/SKILL.md` - The native provider stores a `Date` and does not replace `CalendarDate`
- `projects/ngx-mat-hijri-adapter/package.json` and `src/lib/version.ts` - Version 0.3.1

</details>

<details>
<summary><strong>Docs</strong></summary>

- Date adapter page, home examples, and API group for `ngx-mat-hijri-adapter/native`
- AI agents page leads with `AGENTS.md`
- Roadmap: native adapter implemented, two items under development, MCP server listed as future
- `projects/docs/src/app/app.spec.ts` - Expects version 0.3.1 and the tag URL without a `v` prefix

</details>

<details>
<summary><strong>Workspace</strong></summary>

- `README.md` - Version 0.3.1 and the native `Date` adapter
- `package.json` and `package-lock.json` - Version 0.3.1
- `CHANGELOG.md` - This entry

</details>

---

**Version**: 0.3.1  
**Release Date**: October 10, 2026  
**Maintained by**: Mahmoud

---

## [0.3.0] - 2026-10-10

### ✨ Date fields, install, and docs

This minor release is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. Date fields stay in sync when the calendar changes or a day cannot be parsed, a field can show the locale's month name, and `ng add` registers the adapter. The docs site, renamed from the demo, adds the unpublished-version notice, both form guides, an agent skill page, a contribution policy, and a public roadmap. Each commit below is a squash of one branch into `development`.

#### Changes by Commit

| Commit    | Type       | Description                                                                                                                |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `1701276` | 🔧 Chore   | **Delivery skill**: One branch per task, approval before the commit, then a squash-merge into `development`               |
| `9f9148a` | 🐛 Fix     | **Date fields**: Show a parse error before required, clear both sides outside the Umm al-Qura table, and do calendar math in the active calendar |
| `85b5231` | ✨ Feature | **Month name**: Numeric day/month/year stays the default. A field can show the locale's month name without changing the stored date |
| `213eb2e` | 🔧 Chore   | **Docs app**: Rename the demo project, scripts, and Pages output to the docs app                                          |
| `49b087d` | ✨ Feature | **Unpublished version**: The docs site names this tag and states that the first npm release is 1.0.0                      |
| `eed9a52` | ✨ Feature | **Form guides**: Getting started and the home examples link to both the reactive and signal field pages                   |
| `a35efb2` | ✨ Feature | **ng add**: Install `@internationalized/date` when it is missing and register the adapter once. `ng update` to 1.0.0 does nothing |
| `66d0ca9` | ✨ Feature | **Agent skill**: Ship a skill that tells a coding agent how to install the adapter and store dates                        |
| `4f94e07` | 📝 Docs    | **Contributing**: Target branch, the checks CI runs, a code of conduct, and the pull request rules                        |
| `cf3e6f4` | ✨ Feature | **Roadmap**: Shipped features, the next native Hijri adapter, and ideas that are not scheduled                            |

### 📝 Summary of Changes

#### ✨ Added

- **Month name**: `DateDisplayFormat` is `'numeric'` or `'month-name'`. Numeric day/month/year stays the default. Month name renders as `day month, year`, such as `29 Rabi al-Thani, 1448` or `10 October, 2026`. The stored value stays a `CalendarDate`
- **Unpublished-version banner**: Every docs page names the tagged version and states that it is not on npm, and that the first npm release is the stable 1.0.0
- **Form guides**: Getting started and the home examples link to `/docs/reactive-fields` and `/docs/signal-fields`
- **ng add**: `ng add ngx-mat-hijri-adapter` adds `@internationalized/date` when it is missing and registers `provideHijriDateAdapter()` once. A second run does not register it again. It stops if Angular Material is missing
- **ng update**: The `1.0.0` migration is a no-op, so the command works before a breaking change
- **Agent skill**: `agents/SKILL.md` is shipped in the package. The docs page is `/docs/ai-agents`, and the home page links to it
- **Roadmap**: `/docs/roadmap` has three sections. Implemented lists what ships today. Under development is the next main feature, a Hijri adapter built on the JavaScript `Intl` APIs and the `Date` object. Future lists ideas that are not scheduled and are not a commitment
- **Contribution policy**: Pull requests target `development`. A change states its area of impact and whether it is breaking, includes unit tests, and does not add, upgrade, or remove a third-party package. `CODE_OF_CONDUCT.md` uses the Contributor Covenant

#### 🐛 Fixed

- **Parse errors**: A date field shows the parse error ahead of `required`, with a fallback message when `errorMessages` has no entry
- **Umm al-Qura range**: A day outside AH 1300–1599 clears the displayed value and the stored value together, instead of throwing or leaving the two sides apart
- **Active calendar**: `toIso8601` and `addCalendar*` run in the active calendar
- **Month-name parsing**: Short Arabic month names accept Eastern Arabic digits, and extra spellings such as `Ramadhan`, `Dhul Hijjah`, and `Rabi' al-Awwal` parse to the right month

#### 🔧 Changed

- **Docs app**: The demo project is now `projects/docs`. `npm start` serves it, and the Pages workflow builds that app
- **Version chip**: The header version uses the same border, surface, and shadow as the hero calendar
- **Release link**: The banner links to the git tag, such as `0.3.0`, with no `v` prefix
- **Docs navigation**: AI agents and Roadmap sit apart from the guide links, each with its own icon

#### 🏗️ Build

- **Schematics**: `ng add` and `ng update` compile to CommonJS, because the Angular CLI loads schematic factories with `require()`. The rest of the published package stays ESM
- **Package asset**: ng-packagr copies `agents/SKILL.md` into the package next to the changelog
- **Pages**: A release tag such as `0.3.0` builds the docs app and deploys it to GitHub Pages

### 📦 Modified Files

<details>
<summary><strong>Date fields and adapter</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter.ts` - Calendar math in the active calendar, and an invalid date instead of a throw when adding past the Umm al-Qura table
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter.spec.ts` - Active-calendar and range tests
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter-options.ts` - Adapter options used by the field providers
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/provide-hijri-date-adapter.ts` and `provide-hijri-date-adapter.spec.ts` - Provider coverage for the field setup
- `projects/ngx-mat-hijri-adapter/src/lib/locale/month-names.ts` - Eastern Arabic digits in short Hijri names, and extra month-name spellings
- `projects/ngx-mat-hijri-adapter/internal/src/field-support.ts` - Shared clear-both-sides behavior when a day cannot be kept
- `projects/ngx-mat-hijri-adapter/internal/src/public-api.ts` - Exports the shared field helper
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field-base.ts` - Parse error ahead of required, for both reactive fields
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.ts` and `reactive-date-range-field.ts` - Stay in sync across calendars and parse errors
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.spec.ts` - Date field sync and parse-error tests
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.ts` and `signal-date-range-field.ts` - Same sync rules for signal fields
- `projects/ngx-mat-hijri-adapter/signals/src/signal-errors.ts` - Fallback message when `errorMessages` has no entry
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.spec.ts` - Signal field sync and parse-error tests

</details>

<details>
<summary><strong>Display format</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/formats/date-formats.ts` - `DateDisplayFormat`, `NUMERIC_DATE_INPUT`, and `MONTH_NAME_DATE_INPUT`
- `projects/ngx-mat-hijri-adapter/src/public-api.ts` - Exports the display-format types
- `projects/ngx-mat-hijri-adapter/internal/src/date-field-core.ts` - Formats the input from the field's display format
- `projects/ngx-mat-hijri-adapter/internal/src/field-providers.ts` - Passes the display format into the adapter formats
- `projects/ngx-mat-hijri-adapter/reactive/src/public-api.ts` and `signals/src/public-api.ts` - Re-export the display format
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.spec.ts` and `reactive-date-range-field.spec.ts` - Month-name field tests
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.spec.ts` - Month-name field tests
- `projects/docs/src/app/home/playground/playground.ts` and `playground.html` - Numeric and month-name switch in the playground

</details>

<details>
<summary><strong>Schematics</strong></summary>

- `projects/ngx-mat-hijri-adapter/schematics/ng-add/index.ts` - Checks for Angular Material, adds `@internationalized/date` when missing, and registers the provider once
- `projects/ngx-mat-hijri-adapter/schematics/ng-add/index.spec.ts` - Schematic tests
- `projects/ngx-mat-hijri-adapter/schematics/ng-add/schema.json` and `schema.ts` - `ng add` options
- `projects/ngx-mat-hijri-adapter/schematics/ng-update/index.ts` - No-op migration for 1.0.0
- `projects/ngx-mat-hijri-adapter/schematics/collection.json` and `migration-collection.json` - Schematic collections
- `projects/ngx-mat-hijri-adapter/schematics/package.json` - `"type": "commonjs"` so the CLI can load the factories
- `projects/ngx-mat-hijri-adapter/tsconfig.schematics.json` - Schematic build
- `projects/ngx-mat-hijri-adapter/package.json` - `ng-add` and `ng-update` metadata, and version 0.3.0
- `scripts/build-schematics.mjs` - Compiles the schematics after the library build and before the tests
- `angular.json` - Includes the schematic specs in the library tests
- `package.json` - Build and test run the schematic compile

</details>

<details>
<summary><strong>Agent skill</strong></summary>

- `projects/ngx-mat-hijri-adapter/agents/SKILL.md` - Install path, stored date type, and calendar limits
- `projects/ngx-mat-hijri-adapter/ng-package.json` - Ships the skill as a package asset
- `projects/docs/src/app/docs/pages/ai-agents.ts` and `ai-agents.html` - Docs page for the skill
- `projects/docs/src/app/docs/doc-pages.ts` - AI agents nav entry
- `projects/docs/src/app/home/home.html` and `home.spec.ts` - Home callout linking to the skill page

</details>

<details>
<summary><strong>Docs site</strong></summary>

- `projects/demo` renamed to `projects/docs` - App, pages, examples, and styles
- `.github/workflows/ci.yml` and `pages.yml` - Test and deploy the docs app
- `projects/docs/src/app/app.html` and `app.ts` - Unpublished-version banner and the version chip
- `projects/docs/src/app/app.spec.ts` - Expects version 0.3.0 and the tag URL without a `v` prefix
- `projects/docs/src/app/shared/form-guides.ts` and `form-guides.html` - Links to both field guides
- `projects/docs/src/app/docs/pages/getting-started.ts` and `getting-started.html` - `ng add` as the default install, with the manual command kept
- `projects/docs/src/app/docs/pages/form-fields.ts` and `form-fields.html` - Display format and the form-guide links
- `projects/docs/src/app/docs/pages/roadmap.ts` and `roadmap.html` - Implemented, under development, and future
- `projects/docs/src/app/docs/docs-layout.ts` and `docs-layout.spec.ts` - AI agents and Roadmap set apart from the guide links
- `projects/docs/src/tailwind.css` - Roadmap section spacing
- `README.md` - Docs app path, `ng add`, and version 0.3.0

</details>

<details>
<summary><strong>Contribution and workspace</strong></summary>

- `CONTRIBUTING.md` - Target branch, checks, area of impact, breaking changes, tests, and dependencies
- `CODE_OF_CONDUCT.md` - Contributor Covenant 2.1
- `.github/PULL_REQUEST_TEMPLATE.md` - Summary, impact, breaking change, tests, and dependencies
- `.cursor/skills/development-delivery/SKILL.md` - Private delivery workflow
- `ROADMAP.md` - Task list through the roadmap page, with task 9 done
- `package.json` and `package-lock.json` - Version 0.3.0
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` - `NGX_MAT_HIJRI_ADAPTER_VERSION` is 0.3.0
- `projects/ngx-mat-hijri-adapter/src/lib/version.spec.ts` - Expects version 0.3.0
- `CHANGELOG.md` - This entry

</details>

---

**Version**: 0.3.0  
**Release Date**: October 10, 2026  
**Maintained by**: Mahmoud

---

## [0.2.2] - 2026-10-04

### ✨ Package Logo

This release gives the package a logo: an Angular-style shield with a calendar page and a crescent moon, colored from the demo's Material 3 theme. The library code is unchanged from 0.2.1; the package ships the new README header.

#### Changes by Commit

| Commit    | Type       | Description                                                                                           |
| --------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `a1932dc` | ✨ Feature | **Package Logo**: The logo in the top bar, the hero, the favicon, and the README, in the theme colors |

### 📝 Summary of Changes

#### ✨ Added

- **Logo**: A two-tone shield in the theme's spring green, a calendar page, and a cyan crescent and star. It follows light and dark mode
- **Favicon**: An SVG favicon cropped to the shield, with larger shapes so it reads at 16px, replacing the default Angular icon
- **README Header**: A centered logo, title, description, and badges

#### 🔧 Changed

- **Hero**: The logo sits next to the title, or above it on phones. The text column is wider, the live preview aligns to the right edge, and the Angular, Material, and signal forms line moved below the description
- **Theme Color**: The browser theme color and the README badges use the theme's primary color `#006d33`

### 📦 Modified Files

<details>
<summary><strong>Demo</strong></summary>

- `projects/demo/public/logo.svg` - The logo, with light and dark colors
- `projects/demo/public/favicon.svg` - The favicon, replacing `favicon.ico`
- `projects/demo/src/app/shared/logo.ts` - Logo component in the theme colors
- `projects/demo/src/app/app.html` and `app.ts` - Logo next to the wordmark in the top bar
- `projects/demo/src/app/home/home.html` and `home.ts` - Logo next to the hero title, wider text column, and the line below the description
- `projects/demo/src/app/home/hero-calendar.ts` - Live preview aligned to the right on large screens
- `projects/demo/src/index.html` - SVG favicon and theme color `#006d33`

</details>

<details>
<summary><strong>Workspace and Package</strong></summary>

- `README.md` - Centered logo header, badge colors, and version 0.2.2
- `package.json`, `package-lock.json`, and `projects/ngx-mat-hijri-adapter/package.json` - Version 0.2.2
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` - `NGX_MAT_HIJRI_ADAPTER_VERSION` is 0.2.2
- `projects/ngx-mat-hijri-adapter/src/lib/version.spec.ts` and `projects/demo/src/app/app.spec.ts` - Expect version 0.2.2
- `CHANGELOG.md` - This entry

</details>

---

**Version**: 0.2.2  
**Release Date**: October 4, 2026  
**Maintained by**: Mahmoud

---

## [0.2.1] - 2026-10-03

### 🐛 Gregorian Month Names on Safari

This hotfix fixes Gregorian month names in Arabic on iPhone and other Safari browsers. For `ar-SA`, Safari defaults to the Umm al-Qura calendar, so Gregorian months showed Hijri names such as شعبان in place of مارس. Day numbers and years were always correct, and Chrome and Android were not affected.

#### Changes by Commit

| Commit    | Type   | Description                                                                                             |
| --------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `2b2b9e1` | 🐛 Fix | **Gregorian Month Names**: Always format Gregorian month names in the Gregorian calendar, in any locale |

### 📝 Summary of Changes

#### 🐛 Fixed

- **Gregorian Month Names**: The calendar header, day labels, and formatted dates show Gregorian month names in browsers whose default calendar for the locale is not Gregorian

### 📦 Modified Files

<details>
<summary><strong>Library</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/formats/format-calendar-date.ts` - Gregorian month names request the Gregorian calendar
- `projects/ngx-mat-hijri-adapter/src/lib/formats/format-calendar-date.spec.ts` - Test with a locale that defaults to Umm al-Qura
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` - `NGX_MAT_HIJRI_ADAPTER_VERSION` is 0.2.1
- `projects/ngx-mat-hijri-adapter/src/lib/version.spec.ts` and `projects/demo/src/app/app.spec.ts` - Expect version 0.2.1

</details>

<details>
<summary><strong>Workspace and Package</strong></summary>

- `package.json`, `package-lock.json`, and `projects/ngx-mat-hijri-adapter/package.json` - Version 0.2.1
- `README.md` - Version 0.2.1
- `CHANGELOG.md` - This entry

</details>

---

**Version**: 0.2.1  
**Release Date**: October 3, 2026  
**Maintained by**: Mahmoud

---

## [0.2.0] - 2026-10-03

### ✨ Demo, Documentation & Release Process

This release adds a documentation site and a redesigned live demo, published to GitHub Pages on every release tag. The library code is unchanged from 0.1.0; the package ships the shorter README and this changelog. Each commit below is a squash of one branch into `development`. The branches held work-in-progress commits only, so there are no original subjects to list.

#### Changes by Commit

| Commit    | Type       | Description                                                                                                                      |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `ffa6a08` | ✨ Feature | **Demo Redesign**: Material 3 theme with light, dark, and system modes, a hero, a playground, and example cards with code tabs   |
| `28201d4` | ✨ Feature | **Documentation Pages**: Ten docs pages with side navigation, and the demo styled with Tailwind CSS on top of the Material theme |
| `62e21b1` | ✨ Feature | **Live Preview**: The hero calendar opens on today's date in the visitor's time zone and keeps one height for every month        |
| `a4c387a` | 🏗️ Build   | **GitHub Pages**: Deploy the demo when a release tag is pushed or the workflow is run by hand                                    |
| `f889c72` | 🏗️ Build   | **Release Tags**: Release tags are numbers only, such as `0.2.0`                                                                 |
| `369930a` | 📝 Docs    | **README**: Shortened to an overview with a link to the documentation site                                                       |
| `943bdd4` | 📝 Docs    | **Changelog Format**: Entries use a commit table, a summary, and a modified files list                                           |

### 📝 Summary of Changes

#### ✨ Added

- **Documentation Site**: Getting started, calendar values, date adapter, parsing and formatting, form fields, reactive fields, signal fields, right-to-left, API reference, and gotchas, at [mahmoudtarek44.github.io/ngx-mat-hijri-adapter](https://mahmoudtarek44.github.io/ngx-mat-hijri-adapter/)
- **Playground**: Change the calendar, locale, direction, period, calendar toggle, equivalent-date hint, and touch UI, and see the values and the matching provider and template code
- **Example Cards**: Live Umm al-Qura and Gregorian datepickers and the reactive and signal fields, each with TypeScript and HTML tabs and a copy button
- **Theme**: Light, dark, and system modes, saved in the browser
- **Live Preview**: An inline calendar that switches between Hijri and Gregorian and shows the selected date in both

#### 🔧 Changed

- **Demo Styling**: Tailwind CSS 4 replaces the custom stylesheets. Colors and type come from the Material 3 theme, so both follow light and dark mode
- **README**: Features, installation, requirements, a quick start, and the entry points, with the details moved to the documentation site
- **Changelog**: Rewritten in the commit-table format

#### 🏗️ Build

- **Pages Workflow**: `.github/workflows/pages.yml` builds the library and the demo with the `/ngx-mat-hijri-adapter/` base path, adds a `404.html` fallback for deep links, and deploys to GitHub Pages
- **Tag Format**: Tags such as `0.2.0` trigger the deploy; there is no `v` prefix
- **Demo Dependencies**: `tailwindcss`, `@tailwindcss/postcss`, and `postcss` as development dependencies, configured only for the demo

### 📦 Modified Files

<details>
<summary><strong>Demo Shell and Theme</strong></summary>

- `projects/demo/src/app/app.ts` - Top bar, version chip, theme menu, and footer
- `projects/demo/src/app/app.html` - Shell template
- `projects/demo/src/app/app.routes.ts` - Home and docs routes, loaded on demand
- `projects/demo/src/app/app.config.ts` - Router with anchor scrolling and the Material Symbols icon font
- `projects/demo/src/app/theme/theme.ts` - Light, dark, and system mode service
- `projects/demo/src/app/links.ts` - Repository link
- `projects/demo/src/index.html` - Fonts, description, and theme color
- `projects/demo/src/app/app.spec.ts` - Version chip, navigation, and theme tests

</details>

<details>
<summary><strong>Home</strong></summary>

- `projects/demo/src/app/home/home.ts` - Home page with outlined form fields
- `projects/demo/src/app/home/home.html` - Hero, features, playground, and examples
- `projects/demo/src/app/home/hero-calendar.ts` - Live preview calendar that opens on today's date at a fixed height
- `projects/demo/src/app/home/playground/playground.ts` - Playground state and generated code
- `projects/demo/src/app/home/playground/playground.html` - Playground controls and preview
- `projects/demo/src/app/home/home.spec.ts` - Hero, playground, and example tests

</details>

<details>
<summary><strong>Examples and Shared Components</strong></summary>

- `projects/demo/src/app/examples/calendar-demo/calendar-demo.ts` - Umm al-Qura and Gregorian datepicker examples, moved from `calendar-demo/`
- `projects/demo/src/app/examples/reactive-fields-demo/reactive-fields-demo.ts` - Reactive fields example, moved from `reactive-fields-demo/`
- `projects/demo/src/app/examples/signal-fields-demo/signal-fields-demo.ts` - Signal fields example, moved from `signal-fields-demo/`
- `projects/demo/src/app/examples/snippets.ts` - Code shown in the example tabs
- `projects/demo/src/app/shared/code-block.ts` - Code block with a copy button
- `projects/demo/src/app/shared/example-card.ts` - Card with demo and code tabs
- `projects/demo/src/app/shared/demo-controls.ts` - Locale and direction switches

</details>

<details>
<summary><strong>Documentation</strong></summary>

- `projects/demo/src/app/docs/doc-pages.ts` - Page list and routes
- `projects/demo/src/app/docs/docs-layout.ts` - Side navigation, mobile menu, and previous and next links
- `projects/demo/src/app/docs/pages/*.ts` and `*.html` - The ten documentation pages
- `projects/demo/src/app/docs/docs-layout.spec.ts` - Navigation and page tests

</details>

<details>
<summary><strong>Styles</strong></summary>

- `projects/demo/src/tailwind.css` - Tailwind setup with the Material color and type tokens
- `projects/demo/src/styles.scss` - Material 3 theme with light and dark modes, replacing `styles.css`
- `projects/demo/.postcssrc.json` - Tailwind PostCSS plugin for the demo
- `projects/demo/src/app/app.css` and `calendar-demo/calendar-demo.css` - Removed

</details>

<details>
<summary><strong>Workspace and Package</strong></summary>

- `.github/workflows/pages.yml` - GitHub Pages deploy on release tags and manual runs
- `angular.json` - Demo stylesheets
- `package.json` - Version 0.2.0 and the Tailwind development dependencies
- `package-lock.json` - Version 0.2.0 and the Tailwind packages
- `projects/ngx-mat-hijri-adapter/package.json` - Version 0.2.0
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` - `NGX_MAT_HIJRI_ADAPTER_VERSION` is 0.2.0
- `README.md` - Shorter overview with the documentation link and version 0.2.0
- `CHANGELOG.md` - Commit-table format and this entry

</details>

---

**Version**: 0.2.0  
**Release Date**: October 3, 2026  
**Maintained by**: Mahmoud

---

## [0.1.0] - 2026-10-03

### ✨ New Features

First release. One Angular Material date adapter for the Gregorian and Umm al-Qura calendars, calendar helpers for `CalendarDate` values, and ready-made date and date range fields for reactive forms and signal forms. Each feature commit below is a squash of one feature branch into `development`. The branches held work-in-progress commits only, so there are no original subjects to list.

#### Changes by Commit

| Commit    | Type        | Description                                                                                                                   |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `0e67526` | ✨ Feature  | **Calendar Dates**: Create, convert, compare, and add to `CalendarDate` values in both calendars, limited to AH 1300–1599     |
| `b67c1b1` | ✨ Feature  | **Date Adapter**: `HijriDateAdapter` and `provideHijriDateAdapter()`, with parsing, formats, and month names                  |
| `bb21be3` | ✨ Feature  | **Demo**: Gregorian and Umm al-Qura datepickers with locale and direction switches, a minimum, a maximum, and a Friday filter |
| `c24629b` | ✨ Feature  | **Reactive Fields**: The `/reactive` entry point, `setCalendar()`, and `formatCalendarDate()`                                 |
| `2928b60` | ✨ Feature  | **Signal Fields**: The `/signals` entry point, with the shared field code moved to the private `/internal` entry point        |
| `43db6df` | 🔧 Refactor | **Naming**: Calendar-neutral field names and `ngx-mat-` selectors, `CalendarCode` and `CalendarLocale` constants              |
| `96c901f` | 🏗️ Build    | **Workspace**: Angular 22 library workspace with the unpublished 0.0.0 package, the demo app, and CI                          |
| `680b119` | 🏗️ Build    | **Release 0.1.0**: Version bump, README, and the CHANGELOG shipped inside the package                                         |
| `6a9a5df` | 📝 Docs     | **License**: MIT license                                                                                                      |

### 📝 Summary of Changes

#### ✨ Added

- **Calendar Helpers**: `createCalendarDate`, `convertCalendarDate`, `compareCalendarDates`, `addCalendarDate`, `daysInCalendarMonth`, `monthsInCalendarYear`, and `calendarToday` for `CalendarDate` values in the Gregorian and Umm al-Qura calendars
- **Umm al-Qura Range**: Years are limited to AH 1300–1599 (`UMALQURA_MIN_YEAR`, `UMALQURA_MAX_YEAR`). Dates outside that table throw `UmalquraDateRangeError`
- **Date Adapter**: `HijriDateAdapter`, a Material `DateAdapter<CalendarDate>` that works in either calendar and switches at runtime through `setCalendar()`
- **Provider**: `provideHijriDateAdapter()` registers the adapter, `MAT_DATE_FORMATS`, and `MAT_DATE_LOCALE`. Options are `calendar`, `locale`, `timeZone`, and `formats`
- **Parsing**: `YYYY-MM-DD`, day-month-year text, month names, and Arabic-Indic and Persian digits are read in the adapter calendar, without `Date.parse`
- **Formatting**: `HIJRI_DATE_FORMATS` and `formatCalendarDate()` format a date in its own calendar for any locale
- **Constants**: `CalendarCode` and `CalendarLocale`, and the `SupportedCalendar` type
- **Reactive Fields**: `ngx-mat-hijri-adapter/reactive` with `ReactiveDateField` and `ReactiveDateRangeField`, `ControlValueAccessor` fields for reactive forms
- **Signal Fields**: `ngx-mat-hijri-adapter/signals` with `SignalDateField` and `SignalDateRangeField`, `FormValueControl` fields for signal forms
- **Field Options**: Both field entry points support a value calendar, a Hijri/Gregorian display toggle, an equivalent-date hint, `minDate` and `maxDate`, `period`, `dateFilter`, and error messages
- **Demo App**: Datepickers in both calendars and live cards for the reactive and signal fields

#### 🔧 Changed

- **Field Names**: Before the release, the fields were renamed from `HijriDateField` and `HijriSignalDateField` to `ReactiveDateField` and `SignalDateField`, and their selectors moved from `hijri-` to `ngx-mat-` (for example `ngx-mat-reactive-date-field`)
- **Shared Field Code**: `ngx-mat-hijri-adapter/internal` holds the code shared by `/reactive` and `/signals`. It is not public API and may change in any release

#### 🏗️ Build

- **Requirements**: Angular 22 or newer and `@internationalized/date` 3.12.0 or newer
- **Entry Boundaries**: `scripts/check-entry-boundaries.mjs` fails the build when an entry point imports one it may not use, such as `/reactive` importing `/signals`
- **Package Files**: The README, license, and changelog are copied into the package before each build

### 📦 Modified Files

<details>
<summary><strong>Calendar</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-date.ts` - Calendar helpers and the Umm al-Qura range checks
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/supported-calendars.ts` - `CalendarCode` and `SupportedCalendar`
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-date.spec.ts` - Helper and range tests
- `projects/ngx-mat-hijri-adapter/src/lib/calendar/calendar-code.spec.ts` - Calendar code tests

</details>

<details>
<summary><strong>Adapter, Formats, and Locale</strong></summary>

- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter.ts` - `HijriDateAdapter` with parsing and `setCalendar()`
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter-options.ts` - Adapter options and their injection token
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/provide-hijri-date-adapter.ts` - `provideHijriDateAdapter()`
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/hijri-date-adapter.spec.ts` - Adapter tests
- `projects/ngx-mat-hijri-adapter/src/lib/adapter/provide-hijri-date-adapter.spec.ts` - Provider tests
- `projects/ngx-mat-hijri-adapter/src/lib/formats/date-formats.ts` - `HIJRI_DATE_FORMATS`
- `projects/ngx-mat-hijri-adapter/src/lib/formats/format-calendar-date.ts` - `formatCalendarDate()`
- `projects/ngx-mat-hijri-adapter/src/lib/formats/format-calendar-date.spec.ts` - Formatting tests
- `projects/ngx-mat-hijri-adapter/src/lib/locale/calendar-locale.ts` - `CalendarLocale`
- `projects/ngx-mat-hijri-adapter/src/lib/locale/month-names.ts` - Month names for parsing
- `projects/ngx-mat-hijri-adapter/src/lib/version.ts` - `NGX_MAT_HIJRI_ADAPTER_VERSION` is 0.1.0
- `projects/ngx-mat-hijri-adapter/src/public-api.ts` - Main entry point exports

</details>

<details>
<summary><strong>Reactive Fields</strong></summary>

- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.ts` - `ReactiveDateField`
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-range-field.ts` - `ReactiveDateRangeField`
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field-base.ts` - `ControlValueAccessor` base for both fields
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-field.spec.ts` - Date field tests
- `projects/ngx-mat-hijri-adapter/reactive/src/reactive-date-range-field.spec.ts` - Range field tests
- `projects/ngx-mat-hijri-adapter/reactive/src/public-api.ts` - `/reactive` exports

</details>

<details>
<summary><strong>Signal Fields</strong></summary>

- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.ts` - `SignalDateField`
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-range-field.ts` - `SignalDateRangeField`
- `projects/ngx-mat-hijri-adapter/signals/src/signal-errors.ts` - Datepicker errors as signal form parse errors, and the first error message
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-field.spec.ts` - Date field tests
- `projects/ngx-mat-hijri-adapter/signals/src/signal-date-range-field.spec.ts` - Range field tests
- `projects/ngx-mat-hijri-adapter/signals/src/public-api.ts` - `/signals` exports

</details>

<details>
<summary><strong>Internal</strong></summary>

- `projects/ngx-mat-hijri-adapter/internal/src/date-field-core.ts` - Calendar toggle, hint, and value handling shared by both field sets
- `projects/ngx-mat-hijri-adapter/internal/src/field-support.ts` - Value reading, range types, picker bounds, periods, and the equivalent-date text
- `projects/ngx-mat-hijri-adapter/internal/src/field-providers.ts` - Date formats that keep the app's own formats when registered
- `projects/ngx-mat-hijri-adapter/internal/src/date-field.html` - Date field template
- `projects/ngx-mat-hijri-adapter/internal/src/date-range-field.html` - Range field template
- `projects/ngx-mat-hijri-adapter/internal/src/date-field.css` - Field styles
- `projects/ngx-mat-hijri-adapter/internal/src/public-api.ts` - `ɵ`-prefixed exports

</details>

<details>
<summary><strong>Demo</strong></summary>

- `projects/demo/src/app/app.ts` - Demo shell
- `projects/demo/src/app/calendar-demo/calendar-demo.ts` - Umm al-Qura and Gregorian datepicker cards
- `projects/demo/src/app/reactive-fields-demo/reactive-fields-demo.ts` - Reactive fields card
- `projects/demo/src/app/signal-fields-demo/signal-fields-demo.ts` - Signal fields card
- `projects/demo/src/app/app.spec.ts` - Demo tests

</details>

<details>
<summary><strong>Workspace and Package</strong></summary>

- `package.json` - Version 0.1.0
- `projects/ngx-mat-hijri-adapter/package.json` - Version 0.1.0 and peer dependencies
- `projects/ngx-mat-hijri-adapter/ng-package.json` - Ships `CHANGELOG.md` with the package
- `angular.json` - Library and demo projects
- `scripts/check-entry-boundaries.mjs` - Entry point import check
- `scripts/stage-package-files.mjs` - Copies the README, license, and changelog into the package
- `.github/workflows/ci.yml` - Tests and builds on pushes to `main` and on pull requests
- `README.md` - Package documentation
- `LICENSE` - MIT license

</details>

---

**Version**: 0.1.0  
**Release Date**: October 3, 2026  
**Maintained by**: Mahmoud

---

[0.3.1]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.3.1
[0.3.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.3.0
[0.2.2]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.2
[0.2.1]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.1
[0.2.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.0
[0.1.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.1.0
