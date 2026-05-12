// @bun
// src/index.tsx
import { effect as _$effect } from "@opentui/solid";
import { insertNode as _$insertNode } from "@opentui/solid";
import { memo as _$memo } from "@opentui/solid";
import { insert as _$insert } from "@opentui/solid";
import { createComponent as _$createComponent } from "@opentui/solid";
import { setProp as _$setProp } from "@opentui/solid";
import { createElement as _$createElement } from "@opentui/solid";
import { createSignal, For } from "solid-js";
var nextId = 0;
var tui = async (api) => {
  const [toasts, setToasts] = createSignal([]);
  const addToast = (toast) => {
    const id = nextId++;
    setToasts((prev) => [...prev.length >= 3 ? prev.slice(1) : prev, {
      ...toast,
      id
    }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  };
  const unsub = api.event.on("tui.toast.show", (event) => {
    addToast({
      title: event.properties.title,
      message: event.properties.message,
      variant: event.properties.variant,
      duration: event.properties.duration ?? 5000
    });
  });
  api.lifecycle.onDispose(unsub);
  api.slots.register({
    slots: {
      app: (ctx) => {
        const theme = ctx.theme.current;
        const variantColor = (variant) => {
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
        return (() => {
          var _el$ = _$createElement("box");
          _$setProp(_el$, "position", "absolute");
          _$setProp(_el$, "bottom", 1);
          _$setProp(_el$, "right", 2);
          _$setProp(_el$, "width", 52);
          _$setProp(_el$, "flexDirection", "column");
          _$setProp(_el$, "gap", 1);
          _$insert(_el$, _$createComponent(For, {
            get each() {
              return toasts();
            },
            children: (toast) => {
              const color = variantColor(toast.variant);
              return (() => {
                var _el$2 = _$createElement("box"), _el$3 = _$createElement("text");
                _$insertNode(_el$2, _el$3);
                _$setProp(_el$2, "border", true);
                _$setProp(_el$2, "borderColor", color);
                _$setProp(_el$2, "paddingX", 1);
                _$setProp(_el$2, "paddingY", 0);
                _$setProp(_el$2, "flexDirection", "column");
                _$insert(_el$2, (() => {
                  var _c$ = _$memo(() => !!toast.title);
                  return () => _c$() && (() => {
                    var _el$4 = _$createElement("text");
                    _$setProp(_el$4, "bold", true);
                    _$setProp(_el$4, "color", color);
                    _$insert(_el$4, () => toast.title);
                    return _el$4;
                  })();
                })(), _el$3);
                _$insert(_el$3, () => toast.message);
                _$effect((_$p) => _$setProp(_el$3, "color", theme.text, _$p));
                return _el$2;
              })();
            }
          }));
          return _el$;
        })();
      }
    }
  });
};
var src_default = {
  id: "toast-stack",
  tui
};
export {
  src_default as default
};
