# ngx-mat-hijri-adapter roadmap

Working plan for the adapter refactor and the follow-up release work. Resume from the first task whose status is still open.

## How each task ships

The integration branch is `development`. Leave `main` untouched.

1. Cut a new branch from current `development`.
2. Do the work on that branch and leave it uncommitted.
3. Stop and wait for an explicit approval.
4. After approval, make one commit for that task.
5. Squash-merge the branch into `development`.

One task is one branch and one commit. Do not start the next task until the previous branch is on `development`.

## Status

| #   | Task                                           | Branch                             | Status      |
| --- | ---------------------------------------------- | ---------------------------------- | ----------- |
| 0   | Delivery skill for this repo                   | `chore/development-delivery-skill` | Done        |
| 1   | Adapter refactor                               | `fix/hijri-adapter-review`         | Done        |
| 1a  | Display format on date fields                  | `feat/date-display-format`         | Done        |
| 2   | Rename the demo into the docs app              | `chore/docs-site`                  | Done        |
| 3   | Unpublished-version warning                    | `feat/release-warning`             | Done        |
| 4   | Links to both form guides                      | `feat/forms-docs-nav`              | Done        |
| 5   | `ng add` and `ng update`                       | `feat/ng-add`                      | Done        |
| 6   | Agent skill for people who install the package | `feat/agent-skill`                 | Open        |
| 7   | Public contribution policy                     | `docs/contributing`                | Open        |
| 8   | `@types` package on DefinitelyTyped            | none                               | Will not do |
| 9   | Roadmap page on the docs site                  | `feat/docs-roadmap`                | Open        |
| 10  | Closing workspace check                        | `chore/closing-check`              | Open        |

Task 0 is the private workflow skill. Task 1 is the first product change. Task 1a is the display-format switch and ships before task 2. Tasks 2–7 follow it, in order. Task 8 is a decision, not work. Task 9 adds the public roadmap page. Task 10 runs only after tasks 0–7, 1a, and 9 are done.

When a task is squash-merged, set its status here to `Done` in the same breath as the merge. Once task 9 exists, that same commit also updates the status on `/docs/roadmap`. Until that page exists, this file is the only status list.

## Decisions already settled

- The current minor version (0.2.2) is tagged on GitHub and is not on npm. The first npm release is the stable 1.0.0.
- `ng add ngx-mat-hijri-adapter` is the default install command in the docs. `npm install ngx-mat-hijri-adapter @internationalized/date` stays as the manual alternative. Both apply once 1.0.0 is published.
- Getting started currently shows only a reactive field. That block is replaced with links to `/docs/reactive-fields` and `/docs/signal-fields`.
- The home page already runs live cards for both reactive and signal fields. Those cards stay. The same two links are added above that grid.
- One agent skill ships inside the npm package and is explained on the docs site. A skill that exists only in this repo would not help other developers.
- This library is TypeScript and ng-packagr emits `.d.ts` files. DefinitelyTyped hosts `@types/*` for JavaScript libraries that do not ship types. A `@types/ngx-mat-hijri-adapter` package would duplicate the built-in types, so nothing is submitted there.
- The public names `gregorian` (this package) and `gregory` (the runtime calendar identifier) stay as they are. The AH 1300–1599 Umm al-Qura limit stays as it is.
- Historical paths in `CHANGELOG.md` are not rewritten when the demo project is renamed.

## 0. Delivery skill

Branch: `chore/development-delivery-skill`

Add `.cursor/skills/development-delivery/SKILL.md` so later sessions follow the branch, approval, single-commit, and squash-merge rules without being told again. The skill auto-invokes from its description. Do not put it under `~/.cursor/skills-cursor/`.

This skill is for work inside this repository. It is separate from the public agent skill in task 6.

## 1. Adapter refactor

Branch: `fix/hijri-adapter-review`

Fixes from the code review of `projects/ngx-mat-hijri-adapter`. One related set, one commit.

- Signal and reactive fields show a datepicker parse error ahead of `required`, with a fallback message when the caller did not supply one.
- Writing a value, formatting a signal value, and switching calendars clear both the input and the model when a day is outside AH 1300–1599. They do not throw, and they do not leave the model in place while the input goes blank.
- `toIso8601` and `addCalendarYears` / `addCalendarMonths` / `addCalendarDays` normalize into the active calendar. Tests cover `setCalendar` without calling `clone` first. Moving past the Umm al-Qura table returns an invalid date instead of throwing.
- Optional `firstDayOfWeek` on the adapter options.
- Common Hijri month-name aliases, narrow names that stay distinct across the twelve months, and short Arabic names that use the locale's digits.
- A test with two fields showing different calendars at the same time.

## 1a. Display format on date fields

Branch: `feat/date-display-format`

Date and range fields, reactive and signal, accept `displayFormat`.

- `numeric` is the default. The input shows `29/4/1448` or `10/10/2026`.
- `month-name` shows `29 Rabi al-Thani, 1448` or `10 October, 2026`.
- Digits and the month language follow the field locale, so `ar-SA` shows `٢٩ ربيع الثاني، ١٤٤٨` and `١٠ أكتوبر، ٢٠٢٦`.
- Switching the format redraws the input and leaves the form value unchanged. Each field keeps its own copy of the format slots.
- The playground has a control for the same switch.

## 2. Docs app rename

Branch: `chore/docs-site`

`projects/demo` is already the website: a home page plus `/docs/...`. Rename the Angular project from `demo` to `docs`.

- Git-move `projects/demo` to `projects/docs`.
- Update `angular.json`, the `start`, `build:docs`, and `test:docs` scripts in `package.json`, `tsconfig.json`, `.github/workflows/ci.yml`, and `.github/workflows/pages.yml`.
- Pages keeps the base href `/ngx-mat-hijri-adapter/` and publishes `dist/docs/browser`.
- Update the logo path in `README.md`.

## 3. Unpublished-version warning

Branch: `feat/release-warning`

Add a site-wide banner on the docs app shell so the home page and every docs page show it.

The banner states that the current minor version, read from `NGX_MAT_HIJRI_ADAPTER_VERSION`, is tagged on GitHub and is not published on npm, and that the first npm release will be the stable 1.0.0.

## 4. Links to both form guides

Branch: `feat/forms-docs-nav`

- In Getting started, replace the "Or use a ready-made field" section (reactive field only) with a navigation helper linking to `/docs/reactive-fields` and `/docs/signal-fields`.
- On the home examples section, add those same two links above the live cards. Keep the live Umm al-Qura, Gregorian, reactive, and signal cards.

## 5. `ng add` and `ng update`

Branch: `feat/ng-add`

Follow the Angular guides for library schematics:

- https://angular.dev/tools/libraries/creating-libraries#integrating-with-the-cli-using-code-generation-schematics
- https://angular.dev/tools/cli/schematics-for-libraries

Ship a schematics collection with the library package.

- `ng add ngx-mat-hijri-adapter` installs the package, adds `@internationalized/date` when it is missing, and registers `provideHijriDateAdapter()` on the application. If Angular Material is missing, the schematic stops with a short message.
- `ng update ngx-mat-hijri-adapter` has a migration collection. The first migration is a no-op until there is a real breaking change, so the command works on the first stable release.
- Compile the schematics, test them with `SchematicTestRunner` (provider inserted once, peer install scheduled, second run does not duplicate the provider), and include them in the published package.
- On the home page and Getting started, `ng add ngx-mat-hijri-adapter` is the default install command. Keep the manual `npm install` command beside it.

## 6. Agent skill for package consumers

Branch: `feat/agent-skill`

- Author `projects/ngx-mat-hijri-adapter/agents/SKILL.md` and copy it into the npm package with ng-packagr.
- The skill tells an agent how to use the package: `ng add` as the default setup, `provideHijriDateAdapter()`, `CalendarDate` rather than `Date`, the root, `/reactive`, and `/signals` entry points, `valueCalendar` versus the display toggle, `gregorian` versus the runtime identifier `gregory`, 0-based adapter months versus 1-based helpers, the AH 1300–1599 limit, and that a `@types` package must not be added.
- Add a docs page at `/docs/ai-agents` that says the package includes this skill and how to install it (Cursor `.cursor/skills/`, or the same markdown as `AGENTS.md`).
- Add a short callout on the home page that points at that page.

## 7. Contribution policy

Branch: `docs/contributing`

Public policy for outside contributors. This is separate from the private delivery skill in task 0.

- `CONTRIBUTING.md`: pull requests target `development`, one focused change per pull request, how to build and test, and that npm publishing starts at the stable 1.0.0.
- `.github/PULL_REQUEST_TEMPLATE.md` linked to that policy.
- `CODE_OF_CONDUCT.md` using the Contributor Covenant.
- A link from `README.md`.

## 9. Roadmap page

Branch: `feat/docs-roadmap`

Add a docs page at `/docs/roadmap` and a nav entry named Roadmap. The page is public, so it lists product tasks 1, 1a, 2–7, and the later ideas below. Task 0 stays in this file only.

The page has two sections:

- **Now.** Tasks 1, 1a, 2–7, and 10 with status `Done` or `Open`, matching this file at the time the page is added. Task 8 is shown once as a decision that a `@types` package will not be published. Task 0 stays off the page.
- **Later.** Ideas that are not scheduled. This section starts with the list below. Nothing there is a commitment.

After this page exists, finishing a task includes updating its status on the page in that task's single commit.

## 10. Closing workspace check

Branch: `chore/closing-check`

Start this only after tasks 0–7 and 9 are done and on `development`. It is a review of the library, the docs app, the schematics, the agent skill, the workflows, and the repo root. It looks for gaps, stale paths, and small improvements left behind by the earlier tasks.

The branch records the findings. It does not apply a pile of fixes. Anything worth changing becomes its own later task, with its own branch, after you approve that item. The check also says which ideas in the Later list are worth scheduling.

When the review is accepted, mark task 10 `Done` here and on `/docs/roadmap`.

## Later, not scheduled

Choose these after the closing check. They come from the current package and from what Angular Material apps need. They are not branches yet.

- A `calendarOf()` helper so application code can ask which supported calendar a `CalendarDate` uses, without comparing `gregory` and `gregorian` by hand.
- Hijri month names for Persian and Urdu. The built-in names are Arabic and English only.
- The 1.0.0 npm release itself: version, changelog, tag, and the docs site, which retires the unpublished-version banner.
- A changelog page on the docs site, fed by `CHANGELOG.md`.
- Clearer calendar-toggle buttons. They open the picker, and the accessible name should say so.
- `ng update` migrations kept current when a future Angular Material `DateAdapter` change requires one.
