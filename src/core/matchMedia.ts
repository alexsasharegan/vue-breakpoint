import { MediaQueryString } from "./toMQS";

export type UnsubscribeFunc = () => void;

export interface MediaQueryListEventBasic {
  matches: boolean;
}

/**
 * Since the older `addListener` API is deprecated,
 * but Safari does not support the current standard
 * which inherits from EventTarget, we must perform
 * a check to see if `addEventListener` is available.
 */
const compat = {
  useFallback: false,
};

{
  let mql = window.matchMedia("(min-width: 1px)");
  compat.useFallback = typeof mql.addEventListener !== "function";
}

/**
 * SubscribeToMediaQuery takes a MediaQueryString and callback
 * to be called when the media query state changes.
 * The callback will be invoked immediately to ascertain initial state.
 * An unsubscribe function is returned.
 */
export function SubscribeToMediaQuery(
  query: MediaQueryString,
  listener: (event: MediaQueryListEventBasic) => void
): UnsubscribeFunc {
  const mql = window.matchMedia(query);

  const unsubscribe = () => {
    if (compat.useFallback) {
      // @ts-ignore
      mql.removeListener(listener);
    } else {
      mql.removeEventListener("change", listener);
    }
  };

  if (compat.useFallback) {
    mql.addListener(listener);
  } else {
    mql.addEventListener("change", listener);
  }

  // Trigger initial state since mql fires onchange.
  listener(mql);

  return unsubscribe;
}
