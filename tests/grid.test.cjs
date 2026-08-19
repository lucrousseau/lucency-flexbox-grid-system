const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const sass = require("sass");
const {
  loadBreakpoints,
  BREAKPOINT_NAME,
  BREAKPOINT_VALUE,
} = require("../load-breakpoints");

const root = path.resolve(__dirname, "..");
const breakpointsPath = path.join(root, "breakpoints.json");

function sassPreamble(breakpoints) {
  const variables = Object.entries(breakpoints)
    .map(([key, value]) => `$${key}: ${value};`)
    .join("\n");

  return `${variables}\n`;
}

function compile(source, breakpoints) {
  return sass.compileString(sassPreamble(breakpoints) + source, {
    loadPaths: [path.join(root, "src")],
    style: "expanded",
  }).css;
}

describe("breakpoints.json", () => {
  it("loads as a validated name-to-pixel map", () => {
    const breakpoints = loadBreakpoints(breakpointsPath);

    assert.ok(Object.keys(breakpoints).length > 0);

    for (const [name, value] of Object.entries(breakpoints)) {
      assert.match(name, BREAKPOINT_NAME);
      assert.match(value, BREAKPOINT_VALUE);
    }
  });

  it("rejects values that are not pixel lengths", () => {
    const tmp = path.join(os.tmpdir(), `breakpoints-${Date.now()}.json`);
    fs.writeFileSync(tmp, JSON.stringify({ md: "80em" }));

    assert.throws(
      () => loadBreakpoints(tmp),
      /Invalid breakpoint value/
    );
  });
});

describe("lucencyFlexboxGridSystem", () => {
  const breakpoints = loadBreakpoints(breakpointsPath);

  const css = compile(
    `@import "lucency-flexbox-grid-system";
@include lucencyFlexboxGridSystem(
  $breakpoints: (
    xxl: $xxl,
    xl: $xl,
    lg: $lg,
    md: $md,
    sm: $sm,
    xs: $xs,
  )
);`,
    breakpoints
  );

  it("emits the core layout utilities", () => {
    assert.match(css, /\.lucency\.lucency-flex\s*\{\s*display:\s*flex;/);
    assert.match(css, /\.lucency\.lucency-grid\s*\{\s*display:\s*grid;/);
    assert.match(css, /\.lucency-flex\s*>\s*\.lucency-col\.lucency-col-12\s*\{/);
    assert.match(css, /\.lucency-grid\s*>\s*\.lucency-col\.lucency-col-6\s*\{/);
    assert.match(css, /--get-gap:\s*var\(--gap,\s*1rem\)/);
  });

  it("is desktop-first: each named breakpoint uses max-width", () => {
    for (const [name, value] of Object.entries(breakpoints)) {
      assert.match(
        css,
        new RegExp(
          `@media\\s*\\(max-width:\\s*${value}\\)[\\s\\S]*--${name}`
        )
      );
    }
  });

  it("accepts a custom slug without leaking the default prefix", () => {
    const custom = compile(
      `@import "lucency-flexbox-grid-system";
@include lucencyFlexboxGridSystem($slug: "app");`,
      breakpoints
    );

    assert.match(custom, /\.app\.app-flex/);
    assert.doesNotMatch(custom, /\.lucency\b/);
  });
});
