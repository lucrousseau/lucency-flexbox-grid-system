# Lucency Flexbox Grid System

SCSS mixin that emits **flex** and **CSS Grid** utilities. You choose the class prefix, column count, and breakpoints at compile time. Gap, spacing, and grid track counts can still change in the browser through CSS custom properties.

No JavaScript, no components, no CSS reset. The published artifact is a stylesheet.

After `npm run build`, open `dist/demo/index.html` for a visual walkthrough.

## Approach

- **One mixin.** `lucencyFlexboxGridSystem($slug, $columns, $breakpoints)` is the whole API. Class names match those arguments.
- **Desktop-first.** Unprefixed classes are the default layout. `--md`, `--sm`, and the other suffixes compile to `@media (max-width: …)` and override downward.
- **Cascade with custom properties.** Set `--gap` once; `--gap--md` only where it changes. The same pattern applies to margin, padding, and `--grid-template-columns` / `--grid-template-rows` (track counts, not `repeat()` strings).

This is closer to a generated design token for layout than to a utility framework. Expect a larger CSS file than a hand-written grid: each breakpoint re-emits the utility set.

## Use

**Prebuilt:** `dist/lucency-flexbox-grid-system.css` (`lucency-*`, 12 columns, breakpoints below).

**Custom build:** import the mixin.

```scss
@import "lucency-flexbox-grid-system/src/lucency-flexbox-grid-system";

@include lucencyFlexboxGridSystem(
  $breakpoints: (
    xxl: 1536px,
    xl: 1280px,
    lg: 1024px,
    md: 768px,
    sm: 640px,
    xs: 420px,
  ),
  $columns: 12,
  $slug: "lucency"
);
```

```html
<div class="lucency lucency-flex">
  <div class="lucency-col lucency-col-8 lucency-col-4--md">Primary</div>
  <div class="lucency-col">Side</div>
</div>

<div
  class="lucency lucency-grid"
  style="--grid-template-columns: 4; --grid-template-rows: 2;"
>
  <div class="lucency-col lucency-col-2">A</div>
  <div class="lucency-col">B</div>
</div>
```

| | Default slug `lucency` | Responsive |
| --- | --- | --- |
| Display | `lucency-flex`, `lucency-grid` | `lucency-flex-column--md` |
| Direction / wrap | `lucency-flex-column`, `lucency-flex-row-reverse`, `lucency-flex-wrap-nowrap` | `--{bp}` suffix |
| Alignment | `lucency-justify-between`, `lucency-items-center`, `lucency-content-stretch`, `lucency-self-end` | same |
| Columns | `lucency-col`, `lucency-col-1` … `lucency-col-12` | `lucency-col-12--sm` |
| Grid row span | `lucency-row-1` … `lucency-row-12` | `--{bp}` suffix |
| Pull | `lucency-pull-left`, `lucency-pull-right` | `--{bp}` suffix |
| Text | `lucency-align-left`, `-center`, `-right`, `-justify` | `--{bp}` suffix |

Custom properties on the container (or on a column for margin/padding): `--gap`, `--margin-top`, `--padding-left`, `--grid-template-columns`, `--grid-template-rows`, plus `--md` / `--sm` / … suffixes.

## Breakpoints

`breakpoints.json` drives the Webpack build and is injected into `src/main.scss`. Names are short lowercase tokens; values must be pixel lengths.

| Name | Max width |
| --- | --- |
| (none) | default, no media query |
| `xxl` | 1536px |
| `xl` | 1280px |
| `lg` | 1024px |
| `md` | 768px |
| `sm` | 640px |
| `xs` | 420px |

## Development

```bash
npm install
npm test
npm run build
```

Node 20.9 or newer. `npm start` rebuilds `dist/` on change.

Tests compile the mixin with Dart Sass and check selectors, media queries, a custom slug, and breakpoint validation. They do not snapshot the full CSS.

Layout of the repo:

- `src/lucency-flexbox-grid-system.scss` : public mixin
- `src/mixin/` : generation helpers
- `breakpoints.json` + `load-breakpoints.js` : build-time config
- `src/demo/` : examples compiled into `dist/demo/`
- `tests/` : compile-time contract tests

Webpack and PostCSS stay in `devDependencies`. They are not part of the generated CSS. Breakpoint values are validated before they are written into Sass.

## License

ISC
