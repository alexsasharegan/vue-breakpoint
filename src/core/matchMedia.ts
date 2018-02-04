import { MediaQueryString } from "./toMQS";

export type UnsubscribeFunc = () => void;

/**
 * SubscribeToMediaQuery takes a MediaQueryString and callback
 * to be called when the media query state changes.
 * The callback will be invoked immediately to ascertain initial state.
 * An unsubscribe function is returned.
 */
export function SubscribeToMediaQuery(
	query: MediaQueryString,
	callback: MediaQueryListListener
): UnsubscribeFunc {
	const mql = window.matchMedia(query);
	const unsubscribe = () => mql.removeListener(callback);

	mql.addListener(callback);
	// Trigger initial state since mql fires onchange.
	callback(mql);

	return unsubscribe;
}
