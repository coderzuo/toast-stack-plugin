import { createSignal, For } from "solid-js";
import { TextAttributes } from "@opentui/core";
import type { TuiPlugin, TuiPluginModule } from "@opencode-ai/plugin/tui";

type QueuedToast = {
  id: number;
  title?: string;
  message: string;
  variant: "info" | "success" | "warning" | "error";
  duration: number;
};

let nextId = 0;

const tui: TuiPlugin = async (api) => {
  const [toasts, setToasts] = createSignal<QueuedToast[]>([]);

  const addToast = (toast: Omit<QueuedToast, "id">) => {
    const id = nextId++;
    setToasts((prev) => [
      ...(prev.length >= 3 ? prev.slice(1) : prev),
      { ...toast, id },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  };

  const unsub = api.event.on("tui.toast.show", (event) => {
    addToast({
      title: event.properties.title,
      message: event.properties.message,
      variant: event.properties.variant,
      duration: event.properties.duration ?? 5000,
    });
  });

  api.lifecycle.onDispose(unsub);

  // Fire 3 startup test toasts so the overlay is immediately visible on load
  setTimeout(() => {
    void api.client.tui.showToast({ title: "Toast Stack", message: "Plugin loaded ✓ (1/3)", variant: "success", duration: 8000 });
  }, 1500);
  setTimeout(() => {
    void api.client.tui.showToast({ title: "Toast Stack", message: "Stacking works ✓ (2/3)", variant: "info", duration: 8000 });
  }, 2500);
  setTimeout(() => {
    void api.client.tui.showToast({ title: "Toast Stack", message: "Up to 3 at once ✓ (3/3)", variant: "warning", duration: 8000 });
  }, 3500);

  api.slots.register({
    slots: {
      app: (ctx) => {
        const theme = () => ctx.theme.current;

        const variantColor = (variant: QueuedToast["variant"]) => {
          const t = theme();
          switch (variant) {
            case "error":   return t.error;
            case "warning": return t.warning;
            case "success": return t.success;
            default:        return t.info;
          }
        };

        return (
          <box
            position="absolute"
            bottom={1}
            right={2}
            width={52}
            flexDirection="column"
            gap={1}
          >
            <For each={toasts()}>
              {(toast) => {
                const color = variantColor(toast.variant);
                return (
                  <box
                    border
                    borderColor={color}
                    backgroundColor={theme().backgroundPanel}
                    paddingX={1}
                    paddingY={0}
                    flexDirection="column"
                  >
                    {toast.title && (
                      <text
                        attributes={TextAttributes.BOLD}
                        fg={color}
                      >
                        {toast.title}
                      </text>
                    )}
                    <text fg={theme().text} wrapMode="word" width="100%">
                      {toast.message}
                    </text>
                  </box>
                );
              }}
            </For>
          </box>
        );
      },
    },
  });
};

export default { id: "toast-stack", tui } satisfies TuiPluginModule;
