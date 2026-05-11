import solidPlugin from "@opentui/solid/bun-plugin";

await Bun.build({
  entrypoints: ["src/index.tsx"],
  outdir: "dist",
  target: "bun",
  format: "esm",
  plugins: [solidPlugin],
  external: [
    "@opencode-ai/plugin",
    "@opentui/core",
    "@opentui/solid",
    "solid-js",
  ],
});
