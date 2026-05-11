import { createSignal, For } from "solid-js";
import type { TuiPlugin } from "@opencode-ai/plugin/tui";

type QueuedToast = {
  id: number;
  title?: string;
  message: string;
  variant: "info" | "success" | "warning" | "error";
  duration: number;
};

let nextId = 0;

export const tui: TuiPlugin = async (api) => {
  const [toasts, setToasts] = createSignal<QueuedToast[]>([]);

  const addToast = (toast: Omit<QueuedToast, "id">) => {
    const id = nextId++;
    setToasts((prev) => [...(prev.length >= 3 ? prev.slice(1) : prev), { ...toast, id }]);
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

  api.slots.register({
    slots: {
      app: (ctx) => {
        const theme = ctx.theme.current;

        const variantColor = (variant: QueuedToast["variant"]) => {
          switch (variant) {
            case "error":
              return theme.error;
            case "warning":
              return theme.warning;
            case "success":
              return theme.success;
            default:
              return theme.info;
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
                    paddingX={1}
                    paddingY={0}
                    flexDirection="column"
                  >
                    {toast.title && (
                      <text bold color={color}>
                        {toast.title}
                      </text>
                    )}
                    <text color={theme.text}>{toast.message}</text>
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
