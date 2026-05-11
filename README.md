# toast-stack-plugin

An [opencode](https://opencode.ai) TUI plugin that stacks up to 3 toast notifications simultaneously, instead of replacing them one by one.

## The problem

By default, opencode replaces the current toast with each new one. When model fallbacks happen in quick succession, you only see the last one.

## What this does

- Intercepts every `tui.toast.show` event
- Maintains a queue of up to 3 toasts (oldest drops when a 4th arrives)
- Renders them as a persistent vertical stack in the bottom-right corner
- Each toast auto-dismisses after its duration (default 5s)
- Border and text color matches the variant (info / success / warning / error) from your active theme

## Installation

Add to your `~/.config/opencode/opencode.json`:

```json
"plugin": [
  "file:/path/to/toast-stack-plugin/dist/index.js"
]
```

`dist/index.js` is pre-built and committed — no build step needed on other machines.

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun run build.ts
```
