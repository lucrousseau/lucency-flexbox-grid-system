const fs = require("fs");

const BREAKPOINT_NAME = /^[a-z]{1,8}$/;
const BREAKPOINT_VALUE = /^\d+px$/;

function loadBreakpoints(filePath) {
  const breakpoints = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (
    !breakpoints ||
    typeof breakpoints !== "object" ||
    Array.isArray(breakpoints)
  ) {
    throw new Error("breakpoints.json must be an object of { name: \"Npx\" }");
  }

  for (const [key, value] of Object.entries(breakpoints)) {
    if (!BREAKPOINT_NAME.test(key)) {
      throw new Error(`Invalid breakpoint name "${key}"`);
    }
    if (typeof value !== "string" || !BREAKPOINT_VALUE.test(value)) {
      throw new Error(
        `Invalid breakpoint value for "${key}": expected a pixel length like "768px"`
      );
    }
  }

  return breakpoints;
}

module.exports = {
  loadBreakpoints,
  BREAKPOINT_NAME,
  BREAKPOINT_VALUE,
};
