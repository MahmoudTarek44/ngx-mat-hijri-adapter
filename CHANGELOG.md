# Changelog

All notable changes to ngx-mat-hijri-adapter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta.0] - 2026-10-31

### First npm beta

This is the first release on npm, under the `beta` tag. Install it with `ng add ngx-mat-hijri-adapter@beta` or `npm install ngx-mat-hijri-adapter@beta @internationalized/date`. Ready-made fields store a `CalendarDate`. `ngx-mat-hijri-adapter/native` remains the `Date` alternative for a plain `mat-datepicker`. Stable 1.0.0 will take the `latest` tag.

#### Changes by Commit

| Commit    | Type        | Description                                                                                                 |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `8ec7108` | 🔧 Refactor | **Imports**: Group and order imports in the library and docs, and use `matButton` on the 404 links          |
| `8997ea3` | 🔧 Chore    | **Closing check**: Record the review of the library, docs, schematics, skill, and workflows before the beta |
| `768f143` | 🐛 Fix      | **ng add**: Skip `node_modules` and build output when looking for an existing provider                      |
| `c979fa8` | 📝 Docs     | **Beta install**: `@beta` on the install commands in the README, the agent skill, and the docs              |
| `3e442e9` | 📝 Docs     | **Publishing**: Check the npm dist-tags after the beta publish                                              |
| `2b01d31` | 🏗️ Build    | **Peers**: Angular `^22.0.0` with `@angular/common`, and `@internationalized/date` `^3.12.0`                |
| `5919324` | 🏗️ Build    | **Package page**: `homepage` points at the docs site, with more search keywords                             |
| `0dec861` | 📝 Docs     | **README**: List the `native` entry point and use docs addresses that do not redirect                       |
| `05262c8` | 📝 Docs     | **Agent skill**: Name the field components, selectors, bindings, and value types                            |
| `3c2d7a9` | 🔧 Chore    | **Git ignore**: Ignore the whole `.angular` folder                                                          |
| `c53bbca` | 🔧 Chore    | **Private notes**: Stop tracking the maintainer roadmap, future notes, and delivery skill                   |

### 📝 Summary of Changes

#### 🐛 Fixed

- **ng add**: The schematic no longer looks inside `node_modules` or build output for `provideHijriDateAdapter`. The installed package mentions that name, so in a real app the provider could be skipped

#### 🔧 Changed

- **Peers**: Angular `common`, `core`, `forms`, `material`, and `cdk` at `^22.0.0`, and `@internationalized/date` at `^3.12.0`. The earlier `>=` ranges also claimed Angular 23 and later before they were tested. `@angular/common` is now listed because the field entries import it
- **Install commands**: The README, the agent skill, and the docs use `@beta` while only the beta is on npm
- **Package page**: `homepage` points at the docs site, and the keywords include date adapter, calendar, Umm al-Qura, Arabic, and signal forms
- **Agent skill**: Names the field components, their selectors, the form bindings, and the stored value types
- **README**: Lists the `native` entry point

---

**Version**: 1.0.0-beta.0  
**Release Date**: October 31, 2026  
**Maintained by**: Mahmoud

---

## [0.4.4] - 2026-10-31

### Docs addresses, direction, and not-found page

This patch is tagged on GitHub and is not published on npm. A beta will be published before the stable 1.0.0. Doc pages use the trailing-slash addresses GitHub Pages serves, LTR fields in the Arabic docs keep their labels, and a wrong address shows Page not found.

#### Changes by Commit

| Commit    | Type       | Description                                                                                                     |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `cc5d180` | 🐛 Fix     | **Docs addresses**: Links, canonical URLs, and the sitemap use the trailing-slash addresses GitHub Pages serves |
| `e5346af` | 🐛 Fix     | **Direction**: LTR fields inside the Arabic docs keep Material's LTR notch and label                            |
| `c54e1e6` | ✨ Feature | **Page not found**: A `noindex` screen with links to Home and Docs, served as `404.html`                        |
| `e3d620c` | 📝 Docs    | **Right-to-left**: A short warning that links to the LTR-inside-RTL CSS                                         |
| `74cfa69` | 📝 Docs    | **Changelog**: Describe the Right-to-left warning in this entry                                                 |

### 📝 Summary of Changes

#### 🔧 Changed

- **Search**: Doc links, canonical URLs, `og:url`, and `sitemap.xml` use addresses such as `/docs/getting-started/`. The address without the slash redirects on GitHub Pages
- **Direction**: Angular Material styles RTL fields with `[dir=rtl]` ancestor selectors, so an LTR demo inside the Arabic docs had a clipped label and rotated calendar arrows. The docs restore Material's LTR styles for that case, and the Right-to-left page warns about it and links to the CSS for apps
- **Not found**: An unknown address shows a Page not found screen with links to Home and Docs, marked `noindex` and without a canonical URL. It is served as `404.html`

---

**Version**: 0.4.4  
**Release Date**: October 31, 2026  
**Maintained by**: Mahmoud

---

## [0.4.3] - 2026-10-24

### Docs hydration and search title

This patch is tagged on GitHub and is not published on npm. A beta will be published before the stable 1.0.0. The docs site keeps its English prerender, then applies a saved language and theme. The homepage title is Hijri and Gregorian dates for Angular Material.

#### Changes by Commit

| Commit    | Type    | Description                                                                              |
| --------- | ------- | ---------------------------------------------------------------------------------------- |
| `54d5913` | 🐛 Fix  | **Hydration**: Apply the saved language and theme after the English prerender is claimed |
| `ce50e17` | 📝 Docs | **Search title**: The homepage title, description, favicon, and site name                |

### 📝 Summary of Changes

#### 🔧 Changed

- **Hydration**: A saved language or theme is applied after the English prerender is claimed, so the page no longer throws `NG0500`. The hero calendar is painted in the browser
- **Search**: The homepage title is `Hijri and Gregorian dates for Angular Material`, with a description that also matches reordered Angular Material and Hijri queries. The site icon is a 48px PNG

---

**Version**: 0.4.3  
**Release Date**: October 24, 2026  
**Maintained by**: Mahmoud

---

## [0.4.2] - 2026-10-24

### Docs site and calendar drawing

This patch is tagged on GitHub and is not published on npm. A beta will be published before the stable 1.0.0. The docs site is prerendered English HTML, and a calendar draw reuses its Intl formatters.

#### Changes by Commit

| Commit    | Type       | Description                                                                                          |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `39a7cdd` | 📝 Docs    | **Publishing**: The npm publish guide and measured bundle budget, and reused Intl formatters         |
| `31630f4` | ✨ Feature | **Docs first load**: Prerendered English pages, deferred demos, and the Arabic font loaded on demand |

### 📝 Summary of Changes

#### 🔧 Changed

- **Docs**: Each page is prerendered English HTML with its own title, description, canonical URL, and Open Graph tags, plus `robots.txt` and `sitemap.xml`
- **First load**: Below-the-fold datepicker demos load when they scroll into view. English strings are bundled. The Arabic font loads only after Arabic is chosen
- **Calendar drawing**: Date adapters reuse Intl formatters instead of constructing them on every draw
- **Publishing**: Maintainer steps for the npm beta live in `PUBLISHING.md`, with the measured bundle budget

---

**Version**: 0.4.2  
**Release Date**: October 24, 2026  
**Maintained by**: Mahmoud

---

## [0.4.1] - 2026-10-20

### Roadmap and npm wording

This patch is tagged on GitHub and is not published on npm. A beta will be published before the stable 1.0.0. The public roadmap now treats that stable release, and `ng update` migrations, as work in progress. The changelog stays `CHANGELOG.md` in the GitHub repository.

#### Changes by Commit

| Commit    | Type    | Description                                                                                             |
| --------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `7bf921d` | 📝 Docs | **Roadmap and npm wording**: Under development and future roadmap cards, and the beta-first npm wording |

### 📝 Summary of Changes

#### 🔧 Changed

- **npm wording**: The banner, Getting started, README, and contributing guide no longer say that npm publishing starts at the stable 1.0.0
- **Roadmap**: Stable 1.0.0 release and ng update migrations are under development. The package MCP server stays in Future. The docs changelog page is no longer a roadmap item

---

**Version**: 0.4.1  
**Release Date**: October 20, 2026  
**Maintained by**: Mahmoud

---

## [0.4.0] - 2026-10-20

### Calendar toggle, calendarOf(), and styling

This minor release is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. A field can replace the default calendar buttons without changing the stored `CalendarDate`. `calendarOf()` reads that calendar. The docs explain the native `Date` provider and how a form restyles a field through Material tokens.

#### Changes by Commit

| Commit    | Type       | Description                                                                                              |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `4930c63` | 📝 Docs    | **Native adapter**: Document `provideNativeHijriDateAdapter()` as the alternative for a `Date`           |
| `dbe97dd` | 📝 Docs    | **Native adapter**: Show that restriction as a warning                                                   |
| `f6796fa` | ✨ Feature | **calendarOf()**: Read a `CalendarDate` calendar without comparing `gregory` and `gregorian`             |
| `2432c8f` | ✨ Feature | **Calendar toggle**: A `#calendarToggle` template replaces the default buttons and keeps `valueCalendar` |
| `db1aab2` | 📝 Docs    | **Styling**: Show that ready-made fields inherit Material tokens and have no style input                 |

### 📝 Summary of Changes

#### ✨ Added

- **calendarOf()**: Returns `gregorian` or `islamic-umalqura` for a `CalendarDate`. `gregory` maps to `gregorian`. Any other identifier throws
- **Calendar toggle template**: One `#calendarToggle` template inside a ready-made field replaces the default buttons. `let-controller` receives `display`, `valueCalendar`, `labels`, `disabled`, `show`, and `open`. `show` switches the calendar on screen and leaves the picker closed. `open` switches it and opens the picker. The stored `CalendarDate` stays in `valueCalendar`, and the control is not marked dirty
- **Default toggle icons**: Hijri uses `dark_mode`. Gregorian uses `add_circle_outline`
- **Native adapter page**: `/docs/native-adapter` explains that `provideNativeHijriDateAdapter()` is for a plain `mat-datepicker` that stores a `Date`. A warning states that the ready-made fields do not use it
- **Styling page**: `/docs/styling` shows that the fields inherit the project Material tokens. `mat.form-field-overrides()` on a parent restyles the input. `mat.datepicker-overrides()` on `html` restyles the toggle icon and the calendar popup, because the popup is an overlay

---

**Version**: 0.4.0  
**Release Date**: October 20, 2026  
**Maintained by**: Mahmoud

---

## [0.3.3] - 2026-10-19

### Custom domain and Apache 2.0

This patch is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. The docs site is served from `https://ngx-mat-hijri-adapter.dev/`, and the project license is Apache 2.0.

#### Changes by Commit

| Commit    | Type    | Description                                                                    |
| --------- | ------- | ------------------------------------------------------------------------------ |
| `2b62366` | 📝 Docs | **Docs hosting**: Build the docs site with base href `/` for the custom domain |
| `9d076f1` | 📝 Docs | **License**: Apache License 2.0, replacing MIT                                 |

### 📝 Summary of Changes

#### 🔧 Changed

- **Docs hosting**: GitHub Pages builds the docs app with base href `/`, so scripts and styles load on `https://ngx-mat-hijri-adapter.dev/`. The README links point at that domain
- **License**: The project is released under the Apache License 2.0. Copyright 2026 Mahmoud

---

**Version**: 0.3.3  
**Release Date**: October 19, 2026  
**Maintained by**: Mahmoud

---

## [0.3.2] - 2026-10-11

### Arabic and English docs

This patch is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. The docs site switches between English and Arabic. Framework names such as adapter, provider, and locale stay in English.

#### Changes by Commit

| Commit    | Type    | Description                                                                                         |
| --------- | ------- | --------------------------------------------------------------------------------------------------- |
| `f70a73e` | 📝 Docs | **Docs languages**: English and Arabic, with Noto Kufi Arabic and a right-to-left layout for Arabic |

### 📝 Summary of Changes

#### ✨ Added

- **Docs languages**: The docs site switches between English and Arabic with ngx-translate. Arabic uses the Noto Kufi Arabic font and a right-to-left layout. The language choice is stored in the browser. Framework and technology names stay in English

---

**Version**: 0.3.2  
**Release Date**: October 11, 2026  
**Maintained by**: Mahmoud

---

## [0.3.1] - 2026-10-10

### Native adapter and agent instructions

This patch is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. `provideHijriDateAdapter()` still stores a `CalendarDate`. A second provider stores a JavaScript `Date` when a form needs one. The agent skill page no longer assumes one editor.

#### Changes by Commit

| Commit    | Type       | Description                                                                                                           |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `c9f15fb` | ✨ Feature | **Native adapter**: `provideNativeHijriDateAdapter()` from `ngx-mat-hijri-adapter/native` stores a `Date` at UTC noon |
| `7d2230a` | 📝 Docs    | **AI agents**: Copy the shipped skill to `AGENTS.md`, so any coding agent can follow it                               |

### 📝 Summary of Changes

#### ✨ Added

- **Native Hijri adapter**: `provideNativeHijriDateAdapter()` registers a `DateAdapter<Date>`. `Intl` formats and parses the day with `islamic-umalqura` or `gregory`. An in-repo Umm al-Qura table does the day math for AH 1300–1599. Each value is stored at UTC noon, so a time zone cannot move the civil day. `createDate(1445, 8, 1)` is 1 Ramadan 1445, which is 11 March 2024 at 12:00 UTC
- **Docs examples**: The date adapter page shows both providers. The home page runs a native Umm al-Qura datepicker and a native Gregorian datepicker. The API reference lists the `/native` entry
- **Roadmap**: The native adapter is listed under Implemented. `calendarOf()` and custom calendar-toggle templates are under development. A package MCP server is an unscheduled idea

#### 🔧 Changed

- **AI agents**: After `ng add`, copy `agents/SKILL.md` to `AGENTS.md` at the project root. If that file already exists, add the skill to it. A skills folder is only an example for agents that load `SKILL.md` themselves
- **Default value**: The README states that the default adapter stores `CalendarDate`, and that `/native` stores a `Date` at UTC noon

---

**Version**: 0.3.1  
**Release Date**: October 10, 2026  
**Maintained by**: Mahmoud

---

## [0.3.0] - 2026-10-10

### ✨ Date fields, install, and docs

This minor release is tagged on GitHub and is not published on npm. The first npm release remains the stable 1.0.0. Date fields stay in sync when the calendar changes or a day cannot be parsed, a field can show the locale's month name, and `ng add` registers the adapter. The docs site, renamed from the demo, adds the unpublished-version notice, both form guides, an agent skill page, a contribution policy, and a public roadmap. Each commit below is a squash of one branch into `development`.

#### Changes by Commit

| Commit    | Type       | Description                                                                                                                                      |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `1701276` | 🔧 Chore   | **Delivery skill**: One branch per task, approval before the commit, then a squash-merge into `development`                                      |
| `9f9148a` | 🐛 Fix     | **Date fields**: Show a parse error before required, clear both sides outside the Umm al-Qura table, and do calendar math in the active calendar |
| `85b5231` | ✨ Feature | **Month name**: Numeric day/month/year stays the default. A field can show the locale's month name without changing the stored date              |
| `213eb2e` | 🔧 Chore   | **Docs app**: Rename the demo project, scripts, and Pages output to the docs app                                                                 |
| `49b087d` | ✨ Feature | **Unpublished version**: The docs site names this tag and states that the first npm release is 1.0.0                                             |
| `eed9a52` | ✨ Feature | **Form guides**: Getting started and the home examples link to both the reactive and signal field pages                                          |
| `a35efb2` | ✨ Feature | **ng add**: Install `@internationalized/date` when it is missing and register the adapter once. `ng update` to 1.0.0 does nothing                |
| `66d0ca9` | ✨ Feature | **Agent skill**: Ship a skill that tells a coding agent how to install the adapter and store dates                                               |
| `4f94e07` | 📝 Docs    | **Contributing**: Target branch, the checks CI runs, a code of conduct, and the pull request rules                                               |
| `cf3e6f4` | ✨ Feature | **Roadmap**: Shipped features, the next native Hijri adapter, and ideas that are not scheduled                                                   |

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

---

**Version**: 0.1.0  
**Release Date**: October 3, 2026  
**Maintained by**: Mahmoud

---

[1.0.0-beta.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/1.0.0-beta.0
[0.4.4]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.4.4
[0.4.3]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.4.3
[0.4.2]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.4.2
[0.4.1]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.4.1
[0.4.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.4.0
[0.3.3]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.3.3
[0.3.2]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.3.2
[0.3.1]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.3.1
[0.3.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.3.0
[0.2.2]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.2
[0.2.1]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.1
[0.2.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.2.0
[0.1.0]: https://github.com/MahmoudTarek44/ngx-mat-hijri-adapter/releases/tag/0.1.0
