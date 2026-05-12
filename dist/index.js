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
import { TextAttributes } from "@opentui/core";
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
  setTimeout(() => {
    api.client.tui.showToast({
      title: "Toast Stack",
      message: "Plugin loaded \u2713 (1/3)",
      variant: "success",
      duration: 8000
    });
  }, 1500);
  setTimeout(() => {
    api.client.tui.showToast({
      title: "Toast Stack",
      message: "Stacking works \u2713 (2/3)",
      variant: "info",
      duration: 8000
    });
  }, 2500);
  setTimeout(() => {
    api.client.tui.showToast({
      title: "Toast Stack",
      message: "Up to 3 at once \u2713 (3/3)",
      variant: "warning",
      duration: 8000
    });
  }, 3500);
  api.slots.register({
    slots: {
      app: (ctx) => {
        const theme = () => ctx.theme.current;
        const variantColor = (variant) => {
          const t = theme();
          switch (variant) {
            case "error":
              return t.error;
            case "warning":
              return t.warning;
            case "success":
              return t.success;
            default:
              return t.info;
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
                    _$setProp(_el$4, "fg", color);
                    _$insert(_el$4, () => toast.title);
                    _$effect((_$p) => _$setProp(_el$4, "attributes", TextAttributes.BOLD, _$p));
                    return _el$4;
                  })();
                })(), _el$3);
                _$setProp(_el$3, "wrapMode", "word");
                _$setProp(_el$3, "width", "100%");
                _$insert(_el$3, () => toast.message);
                _$effect((_p$) => {
                  var _v$ = theme().backgroundPanel, _v$2 = theme().text;
                  _v$ !== _p$.e && (_p$.e = _$setProp(_el$2, "backgroundColor", _v$, _p$.e));
                  _v$2 !== _p$.t && (_p$.t = _$setProp(_el$3, "fg", _v$2, _p$.t));
                  return _p$;
                }, {
                  e: undefined,
                  t: undefined
                });
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
